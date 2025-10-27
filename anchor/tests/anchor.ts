import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Anchor } from "../target/types/anchor";
import { expect } from "chai";

describe("anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchor as Program<Anchor>;
  const provider = anchor.getProvider();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Initializes a new hotel", async () => {
    const hotelName = "Test Hotel";
    const verified = true;

    const [hotelPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("hotel"), Buffer.from(hotelName)],
      program.programId
    );

    await program.methods
      .initializeHotel(hotelName, verified)
      .accounts({
        hotel: hotelPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const hotelAccount = await program.account.hotel.fetch(hotelPda);

    expect(hotelAccount.name).to.equal(hotelName);
    expect(hotelAccount.verified).to.equal(verified);
    expect(hotelAccount.owner.toBase58()).to.equal(provider.wallet.publicKey.toBase58());
    expect(hotelAccount.tokenSupply.toNumber()).to.equal(0);
  });

  it("Mints a new membership token", async () => {
    const hotelName = "Another Test Hotel";
    const verified = true;
    const user = anchor.web3.Keypair.generate();

    // Airdrop SOL to the user to pay for the transaction and fee
    await provider.connection.requestAirdrop(user.publicKey, 1000 * anchor.web3.LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 500));


    const [hotelPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("hotel"), Buffer.from(hotelName)],
      program.programId
    );

    await program.methods
      .initializeHotel(hotelName, verified)
      .accounts({
        hotel: hotelPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const [membershipPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("membership"), hotelPda.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    );

    const hotelAuthority = (await program.account.hotel.fetch(hotelPda)).owner;
    const initialAuthorityBalance = await provider.connection.getBalance(hotelAuthority);

    await program.methods
      .mintMembershipToken()
      .accounts({
        hotel: hotelPda,
        membershipToken: membershipPda,
        user: user.publicKey,
        hotelAuthority: hotelAuthority,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const membershipAccount = await program.account.membership.fetch(membershipPda);
    expect(membershipAccount.hotel.toBase58()).to.equal(hotelPda.toBase58());
    expect(membershipAccount.user.toBase58()).to.equal(user.publicKey.toBase58());
    expect(membershipAccount.tokenCount.toNumber()).to.equal(1);
    expect(membershipAccount.pointsBalance.toNumber()).to.equal(0);
    expect(membershipAccount.multiplier).to.equal(1);

    const hotelAccount = await program.account.hotel.fetch(hotelPda);
    expect(hotelAccount.tokenSupply.toNumber()).to.equal(1);

    const finalAuthorityBalance = await provider.connection.getBalance(hotelAuthority);
    const fee = 10_000_000; // 0.01 SOL
    expect(finalAuthorityBalance).to.be.closeTo(initialAuthorityBalance + fee, 20000);
  });

  it("Calculates and updates points", async () => {
    const hotelName = "Points Hotel";
    const verified = true;
    const user = anchor.web3.Keypair.generate();

    // Airdrop SOL to the user
    await provider.connection.requestAirdrop(user.publicKey, 1000 * anchor.web3.LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 500));

    const [hotelPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("hotel"), Buffer.from(hotelName)],
      program.programId
    );

    await program.methods
      .initializeHotel(hotelName, verified)
      .accounts({
        hotel: hotelPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const [membershipPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("membership"), hotelPda.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .mintMembershipToken()
      .accounts({
        hotel: hotelPda,
        membershipToken: membershipPda,
        user: user.publicKey,
        hotelAuthority: (await program.account.hotel.fetch(hotelPda)).owner,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const initialMembershipAccount = await program.account.membership.fetch(membershipPda);

    // Wait for a few seconds to simulate time passing
    await new Promise(resolve => setTimeout(resolve, 2000));

    await program.methods
      .calculateAndUpdatePoints()
      .accounts({
        membershipToken: membershipPda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    const updatedMembershipAccount = await program.account.membership.fetch(membershipPda);
    expect(updatedMembershipAccount.lastPointsUpdate.toNumber()).to.be.greaterThan(initialMembershipAccount.lastPointsUpdate.toNumber());
    // It's hard to assert the exact points earned due to timing, so we'll just check it's not less
    expect(updatedMembershipAccount.pointsBalance.toNumber()).to.be.gte(initialMembershipAccount.pointsBalance.toNumber());
  });

  it("Redeems points", async () => {
    const hotelName = "Redeem Hotel";
    const verified = true;
    const user = anchor.web3.Keypair.generate();

    // Airdrop SOL to the user
    await provider.connection.requestAirdrop(user.publicKey, 1000 * anchor.web3.LAMPORTS_PER_SOL);
    await new Promise(resolve => setTimeout(resolve, 500));

    const [hotelPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("hotel"), Buffer.from(hotelName)],
      program.programId
    );

    await program.methods
      .initializeHotel(hotelName, verified)
      .accounts({
        hotel: hotelPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const [membershipPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("membership"), hotelPda.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .mintMembershipToken()
      .accounts({
        hotel: hotelPda,
        membershipToken: membershipPda,
        user: user.publicKey,
        hotelAuthority: (await program.account.hotel.fetch(hotelPda)).owner,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Add 100 points to the membership account
    await program.methods
      .addPoints(new anchor.BN(100))
      .accounts({
        membershipToken: membershipPda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    let membershipAccount = await program.account.membership.fetch(membershipPda);
    expect(membershipAccount.pointsBalance.toNumber()).to.equal(100);

    // Redeem 50 points
    await program.methods
      .redeemPoints(new anchor.BN(50))
      .accounts({
        membershipToken: membershipPda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    membershipAccount = await program.account.membership.fetch(membershipPda);
    expect(membershipAccount.pointsBalance.toNumber()).to.equal(50);

    // Try to redeem more points than available
    try {
      await program.methods
        .redeemPoints(new anchor.BN(100))
        .accounts({
          membershipToken: membershipPda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();
      expect.fail("Should have failed to redeem more points than available");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("InsufficientPoints");
    }
  });
});