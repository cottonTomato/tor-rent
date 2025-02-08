#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("Au1tsG1thDEY9gaGdh7CPDUbEE8J3G5ykBGQjQdD6vzt");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;
pub const SECONDS_PER_DAY: i64 = 24 * 60 * 60;
pub const SECONDS_PER_MONTH: i64 = 30 * SECONDS_PER_DAY;
pub const IPFS_CID_V1_LENGTH: usize = 59;

#[program]
pub mod torrent {
    use super::*;

    pub fn create_agreement(
        ctx: Context<CreateAgreement>,
        rent_amount: u64,
        deposit_amount: u64,
        duration_months: u8,
    ) -> Result<()> {
        require!(rent_amount > 0, TorrentError::InvalidAmount);
        require!(deposit_amount > 0, TorrentError::InvalidAmount);
        require!(duration_months > 0, TorrentError::InvalidDuration);

        let clock = Clock::get()?;

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.tenant.to_account_info(),
                    to: ctx.accounts.rental_agreement.to_account_info(),
                },
            ),
            deposit_amount,
        )?;

        ctx.accounts.rental_agreement.set_inner(RentalAgreement {
            landlord: ctx.accounts.landlord.key(),
            tenant: ctx.accounts.tenant.key(),
            rent_amount,
            deposit_amount,
            duration_months,
            start_date: clock.unix_timestamp,
            next_payment_date: clock.unix_timestamp + SECONDS_PER_MONTH,
            last_payment_date: clock.unix_timestamp,
            is_active: true,
            missed_payments: 0,
            maintenance_requests: Vec::new(),
        });

        emit!(AgreementCreated {
            landlord: ctx.accounts.landlord.key(),
            tenant: ctx.accounts.tenant.key(),
            rent_amount,
            deposit_amount,
            duration_months,
        });

        Ok(())
    }

    pub fn update_agreement(
        ctx: Context<UpdateAgreement>,
        rent_amount: Option<u64>,
        deposit_amount: Option<u64>,
        duration_months: Option<u8>,
    ) -> Result<()> {
        let rental_agreement = &mut ctx.accounts.rental_agreement;
        require!(rental_agreement.is_active, TorrentError::AgreementInactive);

        if let Some(amount) = rent_amount {
            require!(amount > 0, TorrentError::InvalidAmount);
            rental_agreement.rent_amount = amount;
        }
        if let Some(amount) = deposit_amount {
            require!(amount > 0, TorrentError::InvalidAmount);
            rental_agreement.deposit_amount = amount;
        }
        if let Some(duration) = duration_months {
            require!(duration > 0, TorrentError::InvalidDuration);
            rental_agreement.duration_months = duration;
        }

        emit!(AgreementUpdated {
            agreement: rental_agreement.key(),
            rent_amount: rental_agreement.rent_amount,
            deposit_amount: rental_agreement.deposit_amount,
            duration_months: rental_agreement.duration_months,
        });

        Ok(())
    }

    pub fn terminate_agreement(ctx: Context<TerminateAgreement>) -> Result<()> {
        let rental_agreement = &mut ctx.accounts.rental_agreement;
        require!(rental_agreement.is_active, TorrentError::AgreementInactive);

        let clock = Clock::get()?;
        let contract_end_date = rental_agreement.start_date
            + (rental_agreement.duration_months as i64 * SECONDS_PER_MONTH);

        require!(
            clock.unix_timestamp >= contract_end_date
                || (ctx.accounts.landlord.is_signer && ctx.accounts.tenant.is_signer),
            TorrentError::UnauthorizedTermination
        );

        rental_agreement.is_active = false;

        let deduction = rental_agreement.missed_payments as u64 * rental_agreement.rent_amount;
        let remaining_deposit = rental_agreement.deposit_amount.saturating_sub(deduction);

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.tenant.to_account_info(),
                    to: ctx.accounts.landlord.to_account_info(),
                },
            ),
            remaining_deposit,
        )?;

        if deduction > 0 {
            **ctx.accounts.landlord.try_borrow_mut_lamports()? += deduction;
            **rental_agreement
                .to_account_info()
                .try_borrow_mut_lamports()? -= deduction;
        }

        emit!(AgreementTerminated {
            agreement: ctx.accounts.rental_agreement.key(),
            remaining_deposit,
            deductions: deduction,
        });

        Ok(())
    }

    pub fn pay_rent(ctx: Context<PayRent>) -> Result<()> {
        let rental_agreement = &mut ctx.accounts.rental_agreement;
        let clock = Clock::get()?;

        require!(rental_agreement.is_active, TorrentError::AgreementInactive);

        let contract_end_date = rental_agreement.start_date
            + (rental_agreement.duration_months as i64 * SECONDS_PER_MONTH);
        require!(
            clock.unix_timestamp < contract_end_date,
            TorrentError::ContractExpired
        );

        if clock.unix_timestamp > rental_agreement.next_payment_date {
            rental_agreement.missed_payments += 1;
        }

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.tenant.to_account_info(),
                    to: ctx.accounts.landlord.to_account_info(),
                },
            ),
            rental_agreement.rent_amount,
        )?;

        rental_agreement.last_payment_date = clock.unix_timestamp;
        rental_agreement.next_payment_date = clock.unix_timestamp + SECONDS_PER_MONTH;

        emit!(RentPaid {
            agreement: rental_agreement.key(),
            amount: rental_agreement.rent_amount,
            payment_date: clock.unix_timestamp,
            auto_deducted: false,
        });

        Ok(())
    }

    pub fn attempt_auto_deduction(ctx: Context<AutoDeductRent>) -> Result<()> {
        let rental_agreement = &mut ctx.accounts.rental_agreement;
        let clock = Clock::get()?;

        require!(rental_agreement.is_active, TorrentError::AgreementInactive);

        require!(
            clock.unix_timestamp >= rental_agreement.next_payment_date,
            TorrentError::PaymentNotDue
        );

        let contract_end_date = rental_agreement.start_date
            + (rental_agreement.duration_months as i64 * SECONDS_PER_MONTH);
        require!(
            clock.unix_timestamp < contract_end_date,
            TorrentError::ContractExpired
        );

        let tenant_balance = ctx.accounts.tenant.lamports();

        if tenant_balance >= rental_agreement.rent_amount {
            system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    system_program::Transfer {
                        from: ctx.accounts.tenant.to_account_info(),
                        to: ctx.accounts.landlord.to_account_info(),
                    },
                ),
                rental_agreement.rent_amount,
            )?;

            rental_agreement.last_payment_date = clock.unix_timestamp;
            rental_agreement.next_payment_date = clock.unix_timestamp + SECONDS_PER_MONTH;

            emit!(RentPaid {
                agreement: rental_agreement.key(),
                amount: rental_agreement.rent_amount,
                payment_date: clock.unix_timestamp,
                auto_deducted: true,
            });
        } else {
            rental_agreement.missed_payments = rental_agreement.missed_payments.saturating_add(1);

            emit!(RentPaymentFailed {
                agreement: rental_agreement.key(),
                required_amount: rental_agreement.rent_amount,
                available_balance: tenant_balance,
                missed_payments: rental_agreement.missed_payments,
            });

            if rental_agreement.missed_payments >= 3 {
                emit!(AgreementDefaulted {
                    agreement: rental_agreement.key(),
                    missed_payments: rental_agreement.missed_payments,
                });
            }
        }

        Ok(())
    }

    pub fn submit_maintenance_request(
        ctx: Context<SubmitMaintenanceRequest>,
        description: String,
    ) -> Result<()> {
        require!(description.len() <= 200, TorrentError::InvalidDescription);

        let rental_agreement = &mut ctx.accounts.rental_agreement;
        require!(rental_agreement.is_active, TorrentError::AgreementInactive);

        let clock = Clock::get()?;

        rental_agreement
            .maintenance_requests
            .push(MaintenanceRequest {
                description,
                timestamp: clock.unix_timestamp,
                is_resolved: false,
            });

        emit!(MaintenanceRequestSubmitted {
            agreement: ctx.accounts.rental_agreement.key(),
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn resolve_maintenance_request(
        ctx: Context<ResolveMaintenanceRequest>,
        request_index: u8,
    ) -> Result<()> {
        let rental_agreement = &mut ctx.accounts.rental_agreement;
        require!(rental_agreement.is_active, TorrentError::AgreementInactive);

        require!(
            (request_index as usize) < rental_agreement.maintenance_requests.len(),
            TorrentError::InvalidRequestIndex
        );

        rental_agreement.maintenance_requests[request_index as usize].is_resolved = true;

        emit!(MaintenanceRequestResolved {
            agreement: ctx.accounts.rental_agreement.key(),
            request_index,
        });

        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct RentalAgreement {
    pub landlord: Pubkey,
    pub tenant: Pubkey,
    pub rent_amount: u64,
    pub deposit_amount: u64,
    pub duration_months: u8,
    pub start_date: i64,
    pub next_payment_date: i64,
    pub last_payment_date: i64,
    pub is_active: bool,
    pub missed_payments: u8,
    #[max_len(10)]
    pub maintenance_requests: Vec<MaintenanceRequest>,
}

#[account]
#[derive(InitSpace)]
pub struct MaintenanceRequest {
    #[max_len(200)]
    pub description: String,
    pub timestamp: i64,
    pub is_resolved: bool,
}

#[derive(Accounts)]
pub struct CreateAgreement<'info> {
    #[account(
        init,
        payer = landlord,
        space = ANCHOR_DISCRIMINATOR_SIZE + RentalAgreement::INIT_SPACE,
        seeds = [
            b"rental_agreement",
            landlord.key().to_bytes().as_ref(),
            tenant.key().to_bytes().as_ref(),
        ],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgreement<'info> {
    #[account(
        mut,
        has_one = landlord,
        has_one = tenant,
        seeds = [
            b"rental_agreement",
            landlord.key().to_bytes().as_ref(),
            tenant.key().to_bytes().as_ref(),
        ],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,
    pub landlord: Signer<'info>,
    pub tenant: Signer<'info>,
}

#[derive(Accounts)]
pub struct TerminateAgreement<'info> {
    #[account(
        mut,
        has_one = landlord,
        has_one = tenant,
        seeds = [
            b"rental_agreement",
            landlord.key().to_bytes().as_ref(),
            tenant.key().to_bytes().as_ref(),
        ],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayRent<'info> {
    #[account(
        mut,
        has_one = landlord,
        has_one = tenant,
        seeds = [
            b"rental_agreement",
            landlord.key().to_bytes().as_ref(),
            tenant.key().to_bytes().as_ref(),
        ],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    #[account(mut)]
    pub landlord: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitMaintenanceRequest<'info> {
    #[account(
        mut,
        has_one = tenant,
        seeds = [
            b"rental_agreement",
            rental_agreement.landlord.to_bytes().as_ref(),
            tenant.key().to_bytes().as_ref(),
        ],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,
    pub tenant: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveMaintenanceRequest<'info> {
    #[account(
        mut,
        has_one = landlord,
        seeds = [
            b"rental_agreement",
            landlord.key().to_bytes().as_ref(),
            rental_agreement.tenant.to_bytes().as_ref(),
        ],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,
    pub landlord: Signer<'info>,
}

#[derive(Accounts)]
pub struct AutoDeductRent<'info> {
    #[account(
        mut,
        has_one = tenant,
        has_one = landlord,
        seeds = [
            b"rental_agreement",
            landlord.key().to_bytes().as_ref(),
            tenant.key().to_bytes().as_ref(),
        ],
        bump
    )]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub tenant: SystemAccount<'info>,
    #[account(mut)]
    pub landlord: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[event]
pub struct AgreementCreated {
    pub landlord: Pubkey,
    pub tenant: Pubkey,
    pub rent_amount: u64,
    pub deposit_amount: u64,
    pub duration_months: u8,
}

#[event]
pub struct AgreementUpdated {
    pub agreement: Pubkey,
    pub rent_amount: u64,
    pub deposit_amount: u64,
    pub duration_months: u8,
}

#[event]
pub struct AgreementTerminated {
    pub agreement: Pubkey,
    pub remaining_deposit: u64,
    pub deductions: u64,
}

#[event]
pub struct RentPaid {
    pub agreement: Pubkey,
    pub amount: u64,
    pub auto_deducted: bool,
    pub payment_date: i64,
}

#[event]
pub struct RentPaymentFailed {
    pub agreement: Pubkey,
    pub required_amount: u64,
    pub available_balance: u64,
    pub missed_payments: u8,
}

#[event]
pub struct AgreementDefaulted {
    pub agreement: Pubkey,
    pub missed_payments: u8,
}

#[event]
pub struct MaintenanceRequestSubmitted {
    pub agreement: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct MaintenanceRequestResolved {
    pub agreement: Pubkey,
    pub request_index: u8,
}

#[error_code]
pub enum TorrentError {
    #[msg("Rental agreement is inactive.")]
    AgreementInactive,
    #[msg("Rent payment is not due yet.")]
    PaymentNotDue,
    #[msg("Invalid amount specified.")]
    InvalidAmount,
    #[msg("Invalid duration specified.")]
    InvalidDuration,
    #[msg("Invalid IPFS CID length.")]
    InvalidIpfsCid,
    #[msg("Contract has expired.")]
    ContractExpired,
    #[msg("Unauthorized termination attempt.")]
    UnauthorizedTermination,
    #[msg("Invalid maintenance request description length.")]
    InvalidDescription,
    #[msg("Invalid maintenance request index.")]
    InvalidRequestIndex,
}
