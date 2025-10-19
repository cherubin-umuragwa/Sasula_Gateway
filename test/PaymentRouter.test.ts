import { expect } from "chai";
import { ethers } from "hardhat";

describe("PaymentRouter", function () {
  it("deploys and sends ETH with message", async function () {
    const [alice, bob] = await ethers.getSigners();
    const PaymentRouter = await ethers.getContractFactory("PaymentRouter");
    const router = await PaymentRouter.deploy();
    await router.waitForDeployment();

    const bobBalanceBefore = await ethers.provider.getBalance(bob.address);

    const tx = await router.connect(alice).payETH(bob.address, "Hello from Alice", { value: ethers.parseEther("0.01") });
    const receipt = await tx.wait();
    expect(receipt?.status).to.equal(1);

    // Check event emitted
    const logs = await router.queryFilter(router.filters.PaymentSent());
    expect(logs.length).to.equal(1);
    const log = logs[0];
    expect(log.args.from).to.equal(alice.address);
    expect(log.args.to).to.equal(bob.address);
    expect(log.args.token).to.equal(ethers.ZeroAddress);

    const bobBalanceAfter = await ethers.provider.getBalance(bob.address);
    expect(bobBalanceAfter - bobBalanceBefore).to.equal(ethers.parseEther("0.01"));
  });
});

