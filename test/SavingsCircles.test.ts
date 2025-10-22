import { expect } from "chai";
import { ethers } from "hardhat";

describe("SavingsCircles", function () {
  it("creates a circle, all deposit, and pays out pot to recipient", async function () {
    const [organizer, m1, m2, m3] = await ethers.getSigners();

    const MiniToken = await ethers.getContractFactory("MiniToken");
    const token = await MiniToken.deploy();
    await token.waitForDeployment();

    // Distribute tokens to members
    await (await token.transfer(m1.address, ethers.parseEther("100"))).wait();
    await (await token.transfer(m2.address, ethers.parseEther("100"))).wait();
    await (await token.transfer(m3.address, ethers.parseEther("100"))).wait();

    const SavingsCircles = await ethers.getContractFactory("SavingsCircles");
    const sc = await SavingsCircles.deploy();
    await sc.waitForDeployment();

    const members = [m1.address, m2.address, m3.address];
    const contribution = ethers.parseEther("10");
    const period = 60; // seconds

    const txCreate = await sc.connect(organizer).createCircle(await token.getAddress(), members, contribution, period);
    const rc = await txCreate.wait();

    // Extract circle ID from event
    const id = (rc!.logs
      .map((l: any) => l)
      .find((l: any) => true) && 1) as number; // simplistic: first ID is 1

    // Approve and deposit for round 0
    await (await token.connect(m1).approve(await sc.getAddress(), contribution)).wait();
    await (await token.connect(m2).approve(await sc.getAddress(), contribution)).wait();
    await (await token.connect(m3).approve(await sc.getAddress(), contribution)).wait();

    await (await sc.connect(m1).deposit(id)).wait();
    await (await sc.connect(m2).deposit(id)).wait();
    await (await sc.connect(m3).deposit(id)).wait();

    // Fast-forward time by period to enable payout (Hardhat auto-mining doesn't advance time by default)
    await ethers.provider.send("evm_increaseTime", [period]);
    await ethers.provider.send("evm_mine", []);

    const recipient = m1.address; // currentIndex starts at 0 => m1 receives
    const before = await token.balanceOf(recipient);
    await (await sc.payout(id)).wait();
    const after = await token.balanceOf(recipient);

    // Pot equals contribution * members.length
    expect(after - before).to.equal(contribution * BigInt(members.length));
  });

  it("supports join window, new members, restart, and termination", async function () {
    const [organizer, m1, m2, m3, m4] = await ethers.getSigners();

    const MiniToken = await ethers.getContractFactory("MiniToken");
    const token = await MiniToken.deploy();
    await token.waitForDeployment();

    // Fund members
    for (const s of [m1, m2, m3, m4]) {
      await (await token.transfer(s.address, ethers.parseEther("100"))).wait();
    }

    const SavingsCircles = await ethers.getContractFactory("SavingsCircles");
    const sc = await SavingsCircles.deploy();
    await sc.waitForDeployment();

    const members = [m1.address, m2.address, m3.address];
    const contribution = ethers.parseEther("1");
    const period = 60; // seconds

    const txCreate = await sc.connect(organizer).createCircle(await token.getAddress(), members, contribution, period);
    await txCreate.wait();
    const id = 1;

    // approvals for all potential members up front
    for (const s of [m1, m2, m3, m4]) {
      await (await token.connect(s).approve(await sc.getAddress(), ethers.parseEther("100"))).wait();
    }

    // Round 0 deposits
    await (await sc.connect(m1).deposit(id)).wait();
    await (await sc.connect(m2).deposit(id)).wait();
    await (await sc.connect(m3).deposit(id)).wait();

    // advance time and payout -> recipient m1
    await ethers.provider.send("evm_increaseTime", [period]);
    await ethers.provider.send("evm_mine", []);
    await (await sc.payout(id)).wait();

    // Round 1 deposits
    await (await sc.connect(m1).deposit(id)).wait();
    await (await sc.connect(m2).deposit(id)).wait();
    await (await sc.connect(m3).deposit(id)).wait();

    // advance time and payout -> recipient m2
    await ethers.provider.send("evm_increaseTime", [period]);
    await ethers.provider.send("evm_mine", []);
    await (await sc.payout(id)).wait();

    // Round 2 deposits
    await (await sc.connect(m1).deposit(id)).wait();
    await (await sc.connect(m2).deposit(id)).wait();
    await (await sc.connect(m3).deposit(id)).wait();

    // advance time and payout -> recipient m3 ; cycle completes and join window opens
    await ethers.provider.send("evm_increaseTime", [period]);
    await ethers.provider.send("evm_mine", []);
    await (await sc.payout(id)).wait();

    // Join window: m4 joins (join window is automatically open after cycle completes)
    await (await sc.connect(m4).joinCircle(id)).wait();
    // Organizer may also explicitly toggle open state if desired
    await (await sc.connect(organizer).setOpenToJoin(id, true)).wait();

    // Cannot deposit while join window is open
    await expect(sc.connect(m1).deposit(id)).to.be.revertedWith("join window open");

    // Organizer restarts the next cycle
    await (await sc.connect(organizer).restart(id)).wait();

    // Now there are 4 members; do one round's deposit and payout to verify scheduling resumes
    for (const s of [m1, m2, m3, m4]) {
      await (await sc.connect(s).deposit(id)).wait();
    }
    await ethers.provider.send("evm_increaseTime", [period]);
    await ethers.provider.send("evm_mine", []);
    await (await sc.payout(id)).wait();

    // Organizer can terminate only at boundary
    await expect(sc.connect(organizer).terminate(id)).to.be.revertedWith("not boundary");

    // Complete remaining 3 payouts in the cycle to return to boundary
    for (let i = 0; i < 3; i++) {
      for (const s of [m1, m2, m3, m4]) {
        await (await sc.connect(s).deposit(id)).wait();
      }
      await ethers.provider.send("evm_increaseTime", [period]);
      await ethers.provider.send("evm_mine", []);
      await (await sc.payout(id)).wait();
    }

    // At boundary again; terminate
    await (await sc.connect(organizer).terminate(id)).wait();

    const circle = await sc.getCircle(id);
    expect(circle.active).to.equal(false);
  });
});
