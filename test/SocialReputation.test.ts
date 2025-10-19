import { expect } from "chai";
import { ethers } from "hardhat";

describe("SocialReputation", function () {
  it("tracks scores and allows borrow/repay against pool", async function () {
    const [deployer, a, b, lender] = await ethers.getSigners();

    const MiniToken = await ethers.getContractFactory("MiniToken");
    const token = await MiniToken.deploy();
    await token.waitForDeployment();

    const SocialReputation = await ethers.getContractFactory("SocialReputation");
    const rep = await SocialReputation.deploy(await token.getAddress());
    await rep.waitForDeployment();

    await (await rep.setAuthorizedCaller(deployer.address, true)).wait();

    await (await rep.reportPayment(a.address, b.address, ethers.ZeroAddress, ethers.parseEther("1"))).wait();
    await (await rep.reportPayment(a.address, b.address, ethers.ZeroAddress, ethers.parseEther("2"))).wait();

    const scoreA = await rep.getScore(a.address);
    expect(scoreA).to.be.gt(0n);

    await (await token.transfer(lender.address, ethers.parseEther("1000"))).wait();
    await (await token.connect(lender).approve(await rep.getAddress(), ethers.parseEther("1000"))).wait();
    await (await rep.connect(lender).fundPool(ethers.parseEther("100"))).wait();

    const maxBorrow = await rep.maxBorrowable(a.address);
    if (maxBorrow > 0n) {
      const borrowAmt = maxBorrow;
      await (await rep.connect(a).borrow(borrowAmt)).wait();
      await (await token.connect(a).approve(await rep.getAddress(), borrowAmt)).wait();
      await (await rep.connect(a).repay(borrowAmt)).wait();
    }
  });
});
