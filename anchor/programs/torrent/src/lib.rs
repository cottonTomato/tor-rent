#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod torrent {
    use super::*;

  pub fn close(_ctx: Context<CloseTorrent>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.torrent.count = ctx.accounts.torrent.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.torrent.count = ctx.accounts.torrent.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeTorrent>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.torrent.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeTorrent<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Torrent::INIT_SPACE,
  payer = payer
  )]
  pub torrent: Account<'info, Torrent>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTorrent<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub torrent: Account<'info, Torrent>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub torrent: Account<'info, Torrent>,
}

#[account]
#[derive(InitSpace)]
pub struct Torrent {
  count: u8,
}
