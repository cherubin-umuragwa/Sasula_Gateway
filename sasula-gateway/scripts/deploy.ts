import { ethers, network } from "hardhat";

async function main() {
  console.log(`Deploying to network: ${network.name}`);

  const PaymentRouter = await ethers.getContractFactory("PaymentRouter");
  const paymentRouter = await PaymentRouter.deploy();
  await paymentRouter.waitForDeployment();
  console.log("PaymentRouter deployed at:", await paymentRouter.getAddress());

  const EmergencyMode = await ethers.getContractFactory("EmergencyMode");
  const emergencyMode = await EmergencyMode.deploy();
  await emergencyMode.waitForDeployment();
  console.log("EmergencyMode deployed at:", await emergencyMode.getAddress());

  // Optional: deploy SocialReputation with MiniToken as loan token (demo)
  const MiniToken = await ethers.getContractFactory("MiniToken");
  const mini = await MiniToken.deploy();
  await mini.waitForDeployment();
  console.log("MiniToken deployed at:", await mini.getAddress());

  const SocialReputation = await ethers.getContractFactory("SocialReputation");
  const rep = await SocialReputation.deploy(await mini.getAddress());
  await rep.waitForDeployment();
  console.log("SocialReputation deployed at:", await rep.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
