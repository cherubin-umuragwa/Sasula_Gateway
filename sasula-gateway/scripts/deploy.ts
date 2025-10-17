import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

function upsertEnv(filePath: string, updates: Record<string, string>) {
  let lines: string[] = [];
  if (fs.existsSync(filePath)) {
    lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  }
  const keys = Object.keys(updates);
  const seen = new Set<string>();

  lines = lines.map((line) => {
    const m = line.match(/^([A-Z0-9_]+)=/);
    if (!m) return line;
    const key = m[1];
    if (key in updates) {
      seen.add(key);
      return `${key}=${updates[key]}`;
    }
    return line;
  });

  for (const k of keys) {
    if (!seen.has(k)) {
      lines.push(`${k}=${updates[k]}`);
    }
  }
  fs.writeFileSync(filePath, lines.join("\n"));
}

async function main() {
  console.log(`Deploying to network: ${network.name}`);

  const PaymentRouter = await ethers.getContractFactory("PaymentRouter");
  const paymentRouter = await PaymentRouter.deploy();
  await paymentRouter.waitForDeployment();
  const paymentRouterAddr = await paymentRouter.getAddress();
  console.log("PaymentRouter deployed at:", paymentRouterAddr);

  const EmergencyMode = await ethers.getContractFactory("EmergencyMode");
  const emergencyMode = await EmergencyMode.deploy();
  await emergencyMode.waitForDeployment();
  const emergencyModeAddr = await emergencyMode.getAddress();
  console.log("EmergencyMode deployed at:", emergencyModeAddr);

  const MiniToken = await ethers.getContractFactory("MiniToken");
  const mini = await MiniToken.deploy();
  await mini.waitForDeployment();
  const miniAddr = await mini.getAddress();
  console.log("MiniToken deployed at:", miniAddr);

  const SocialReputation = await ethers.getContractFactory("SocialReputation");
  const rep = await SocialReputation.deploy(miniAddr);
  await rep.waitForDeployment();
  const repAddr = await rep.getAddress();
  console.log("SocialReputation deployed at:", repAddr);

  // NEW: deploy SavingsCircles
  const SavingsCircles = await ethers.getContractFactory("SavingsCircles");
  const sc = await SavingsCircles.deploy();
  await sc.waitForDeployment();
  const scAddr = await sc.getAddress();
  console.log("SavingsCircles deployed at:", scAddr);

  // Write a deployments file for reference
  const outDir = path.join(process.cwd(), "deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, `${network.name}.json`);
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      {
        network: network.name,
        paymentRouter: paymentRouterAddr,
        emergencyMode: emergencyModeAddr,
        miniToken: miniAddr,
        socialReputation: repAddr,
        savingsCircles: scAddr,
      },
      null,
      2
    )
  );
  console.log("Wrote deployments to:", outFile);

  // Optional: auto-update .env if UPDATE_ENV=true
  if (process.env.UPDATE_ENV === "true") {
    const envPath = path.join(process.cwd(), ".env");
    upsertEnv(envPath, {
      NEXT_PUBLIC_CONTRACT_ADDRESS: paymentRouterAddr,
      NEXT_PUBLIC_EMERGENCY_MODE_ADDRESS: emergencyModeAddr,
      NEXT_PUBLIC_MINI_TOKEN_ADDRESS: miniAddr,
      NEXT_PUBLIC_SOCIAL_REPUTATION_ADDRESS: repAddr,
      NEXT_PUBLIC_SAVINGS_CIRCLES_ADDRESS: scAddr,
    });
    console.log("Updated .env with deployed addresses.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});