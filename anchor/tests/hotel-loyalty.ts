const assert = require("assert");
const anchor = require("@coral-xyz/anchor");
const { SystemProgram } = anchor.web3;

describe("hotel-loyalty", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Anchor;

  const hotelOwner = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();

  const hotelName = "Solana Beach Hotel";
  let hotelPda, hotelBump;
  let membershipPda, membershipBump;

  before(async () => {
    // Airdrop SOL to our test wallets
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(hotelOwner.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
      "confirmed"
    );

    // Find the PDA for the hotel
    [hotelPda, hotelBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("hotel"), Buffer.from(hotelName)],
      program.programId
    );

    // Find the PDA for the membership
    [membershipPda, membershipBump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("membership"), hotelPda.toBuffer(), user.publicKey.toBuffer()],
        program.programId
    );
  });

  it("Initializes a new hotel", async () => {
    await program.methods
      .initializeHotel(hotelName, true) // verified = true
      .accounts({
        hotel: hotelPda,
        authority: hotelOwner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([hotelOwner])
      .rpc();

    const hotelAccount = await program.account.hotel.fetch(hotelPda);
    assert.strictEqual(hotelAccount.name, hotelName);
    assert.strictEqual(hotelAccount.verified, true);
    assert.ok(hotelAccount.owner.equals(hotelOwner.publicKey));
    assert.ok(hotelAccount.tokenSupply.eqn(0));
  });

  it("Mints a membership token", async () => {
    const initialBalance = await provider.connection.getBalance(hotelOwner.publicKey);

    await program.methods
      .mintMembershipToken()
      .accounts({
        hotel: hotelPda,
        membershipToken: membershipPda,
        user: user.publicKey,
        hotelAuthority: hotelOwner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const membershipAccount = await program.account.membership.fetch(membershipPda);
    assert.ok(membershipAccount.user.equals(user.publicKey));
    assert.ok(membershipAccount.hotel.equals(hotelPda));
    assert.ok(membershipAccount.pointsBalance.eqn(0));

    const hotelAccount = await program.account.hotel.fetch(hotelPda);
    assert.ok(hotelAccount.tokenSupply.eqn(1));

    // Check if hotel owner received the fee
    const finalBalance = await provider.connection.getBalance(hotelOwner.publicKey);
    assert.ok(finalBalance > initialBalance);
  });

  it("Calculates and updates points after time", async () => {
    // This is a simplified test. In a real scenario, you might need to manipulate
    // the validator's clock, which is complex. Here, we'll just call it and expect
    // a small or zero point change since not much time has passed.
    await program.methods
      .calculateAndUpdatePoints()
      .accounts({
        membershipToken: membershipPda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    const membershipAccount = await program.account.membership.fetch(membershipPda);
    // Points earned will be 0 as no real time has passed in the test validator
    assert.ok(membershipAccount.pointsBalance.eqn(0)); 
  });

  it("Fails to redeem more points than available", async () => {
    try {
      await program.methods
        .redeemPoints(new anchor.BN(100))
        .accounts({
          membershipToken: membershipPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();
      assert.fail("Should have failed for insufficient points.");
    } catch (err) {
      assert.strictEqual(err.error.errorCode.code, "InsufficientPoints");
    }
  });

  it("Adds and redeems points successfully", async () => {
    // Manually add some points for testing redemption
    await program.methods
      .addPoints(new anchor.BN(500))
      .accounts({ 
          membershipToken: membershipPda, 
          user: user.publicKey 
        })
      .signers([user])
      .rpc();

    let membershipAccount = await program.account.membership.fetch(membershipPda);
    assert.ok(membershipAccount.pointsBalance.eqn(500));

    // Now redeem some points
    await program.methods
      .redeemPoints(new anchor.BN(200))
      .accounts({
        membershipToken: membershipPda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    membershipAccount = await program.account.membership.fetch(membershipPda);
    assert.ok(membershipAccount.pointsBalance.eqn(300));
  });

  it("Fails to mint a token for an unverified hotel", async () => {
    const unverifiedHotelName = "Shady Motel";
    const [unverifiedHotelPda] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("hotel"), Buffer.from(unverifiedHotelName)],
        program.programId
    );
    const [unverifiedMembershipPda] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("membership"), unverifiedHotelPda.toBuffer(), user.publicKey.toBuffer()],
        program.programId
    );

    // Initialize an unverified hotel
    await program.methods
      .initializeHotel(unverifiedHotelName, false) // verified = false
      .accounts({ 
          hotel: unverifiedHotelPda, 
          authority: hotelOwner.publicKey, 
          systemProgram: SystemProgram.programId 
        })
      .signers([hotelOwner])
      .rpc();

    // Attempt to mint
    try {
      await program.methods
        .mintMembershipToken()
        .accounts({
            hotel: unverifiedHotelPda,
            membershipToken: unverifiedMembershipPda,
            user: user.publicKey,
            hotelAuthority: hotelOwner.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
      assert.fail("Should have failed for unverified hotel.");
    } catch (err) {
      assert.strictEqual(err.error.errorCode.code, "HotelNotVerified");
    }
  });
});
