import { expect } from "chai";
import { ethers } from "hardhat";

describe("EmergencyMode", function () {
  it("allows admin to set global and regional emergencies and authorities", async function () {
    const [admin, gov, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("EmergencyMode");
    const em = await Factory.deploy();
    await em.waitForDeployment();

    await (await em.setAuthority(gov.address, true)).wait();
    await (await em.connect(gov).setGlobalEmergency(true)).wait();
    expect(await em.globalEmergency()).to.eq(true);

    const region = ethers.id("UG-Kampala");
    await (await em.connect(gov).setRegionEmergency(region, true)).wait();
    expect(await em.regionEmergency(region)).to.eq(true);

    expect(await em.isEmergency(region)).to.eq(true);
  });
});
