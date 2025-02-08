#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Au1tsG1thDEY9gaGdh7CPDUbEE8J3G5ykBGQjQdD6vzt");

#[program]
pub mod torrent {
    use super::*;

    pub fn create_agreement(ctx: Context<CreateAgreement>) -> Result<()> {
        Ok(())
    }

    pub fn update_agreement(ctx: Context<UpdateAgreement>) -> Result<()> {
        Ok(())
    }

    pub fn terminate_agreement(ctx: Context<TerminateAgreement>) -> Result<()> {
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
    #[max_len(50)]
    pub ipfs_cid: String,
    pub is_active: bool,
}

#[derive(Accounts)]
pub struct CreateAgreement<'info> {
    #[account(init, payer = landlord, space = 8 + RentalAgreement::INIT_SPACE)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgreement<'info> {
    #[account(mut, has_one = landlord)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
}

#[derive(Accounts)]
pub struct TerminateAgreement<'info> {
    #[account(mut, has_one = landlord)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    pub system_program: Program<'info, System>,
}
