use anchor_lang::prelude::*;

declare_id!("DSsad7SycJg39A2PUgGpLgyrvPytkvCiKhvAhS4j7ANz");

#[program]
pub mod anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn initialize_hotel(ctx: Context<InitializeHotel>, name: String, verified: bool) -> Result<()> {
        let hotel = &mut ctx.accounts.hotel;
        hotel.hotel_id = *hotel.to_account_info().key;
        hotel.name = name;
        hotel.verified = verified;
        hotel.owner = *ctx.accounts.authority.key;
        hotel.token_supply = 0;
        hotel.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn mint_membership_token(ctx: Context<MintMembershipToken>) -> Result<()> {
        if !ctx.accounts.hotel.verified {
            return err!(ErrorCode::HotelNotVerified);
        }

        let membership_token = &mut ctx.accounts.membership_token;
        membership_token.hotel = ctx.accounts.hotel.key();
        membership_token.user = ctx.accounts.user.key();
        membership_token.token_count = 1;
        membership_token.points_balance = 0;
        membership_token.last_points_update = Clock::get()?.unix_timestamp;
        membership_token.multiplier = 1;
        membership_token.timestamp = Clock::get()?.unix_timestamp;

        let hotel = &mut ctx.accounts.hotel;
        hotel.token_supply = hotel.token_supply.checked_add(1).unwrap();

        let fee = 10_000_000; // 0.01 SOL in lamports
        let from_account = &ctx.accounts.user.to_account_info();
        let to_account = &ctx.accounts.hotel_authority;

        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: from_account.clone(),
            to: to_account.clone(),
        };
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );
        anchor_lang::system_program::transfer(cpi_context, fee)?;

        Ok(())
    }

    pub fn calculate_and_update_points(ctx: Context<CalculateAndUpdatePoints>) -> Result<()> {
        let membership_token = &mut ctx.accounts.membership_token;
        let current_timestamp = Clock::get()?.unix_timestamp;

        let days_elapsed = (current_timestamp - membership_token.last_points_update) / (24 * 60 * 60);
        let points_earned = days_elapsed as u64 * membership_token.multiplier as u64;

        membership_token.points_balance = membership_token.points_balance.checked_add(points_earned).unwrap();
        membership_token.last_points_update = current_timestamp;

        Ok(())
    }

    pub fn redeem_points(ctx: Context<RedeemPoints>, points_to_redeem: u64) -> Result<()> {
        let membership_token = &mut ctx.accounts.membership_token;

        if membership_token.points_balance < points_to_redeem {
            return err!(ErrorCode::InsufficientPoints);
        }

        membership_token.points_balance = membership_token.points_balance.checked_sub(points_to_redeem).unwrap();

        msg!("Redeemed {} points. New balance: {}", points_to_redeem, membership_token.points_balance);

        Ok(())
    }

    pub fn add_points(ctx: Context<AddPoints>, points: u64) -> Result<()> {
        let membership_token = &mut ctx.accounts.membership_token;
        membership_token.points_balance = membership_token.points_balance.checked_add(points).unwrap();
        msg!("Added {} points. New balance: {}", points, membership_token.points_balance);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeHotel<'info> {
    #[account(
        init,
        payer = authority,
        space = 500,
        seeds = [b"hotel", name.as_bytes()],
        bump
    )]
    pub hotel: Account<'info, Hotel>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintMembershipToken<'info> {
    #[account(mut)]
    pub hotel: Account<'info, Hotel>,
    #[account(
        init,
        payer = user,
        space = Membership::LEN,
        seeds = [b"membership", hotel.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub membership_token: Account<'info, Membership>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: This is not dangerous because we check it against the hotel owner
    #[account(mut, constraint = hotel.owner == hotel_authority.key() @ ErrorCode::InvalidHotelOwner)]
    pub hotel_authority: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CalculateAndUpdatePoints<'info> {
    #[account(mut, has_one = user)]
    pub membership_token: Account<'info, Membership>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RedeemPoints<'info> {
    #[account(mut, has_one = user)]
    pub membership_token: Account<'info, Membership>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddPoints<'info> {
    #[account(mut, has_one = user)]
    pub membership_token: Account<'info, Membership>,
    pub user: Signer<'info>,
}


#[account]
pub struct Hotel {
    pub hotel_id: Pubkey,
    pub name: String,
    pub verified: bool,
    pub owner: Pubkey,
    pub token_supply: u64,
    pub timestamp: i64,
}

impl Hotel {
    pub const LEN: usize = 8 + 32 + (4 + 50) + 1 + 32 + 8 + 8;
}

#[account]
pub struct Membership {
    pub user: Pubkey,
    pub hotel: Pubkey,
    pub token_count: u64,
    pub points_balance: u64,
    pub last_points_update: i64,
    pub multiplier: u8,
    pub timestamp: i64,
}

impl Membership {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 8 + 1 + 8;
}

#[account]
pub struct PointsLedger {
    pub user: Pubkey,
    pub hotel: Pubkey,
    pub points_balance: u64,
    pub timestamp: i64,
}

impl PointsLedger {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Hotel is not verified.")]
    HotelNotVerified,
    #[msg("Invalid hotel owner.")]
    InvalidHotelOwner,
    #[msg("Insufficient points to redeem.")]
    InsufficientPoints,
}
