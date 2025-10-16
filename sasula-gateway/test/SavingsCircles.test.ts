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
});
