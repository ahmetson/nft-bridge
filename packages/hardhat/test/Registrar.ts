import { expect } from "chai";
import { ethers } from "hardhat";
import { Registrar } from "../typechain-types";

describe("Registrar.sol", function () {
  // We define a fixture to reuse the same setup in every test.

  let registrar: Registrar;
  before(async () => {
    const registrarFactory = await ethers.getContractFactory("Registrar.sol");
    registrar = (await registrarFactory.deploy()) as Registrar;
    await registrar.deployed();
  });

  describe("Deployment", function () {
    it("Should have the right message on deploy", async function () {
      expect(await registrar.greeting()).to.equal("Building Unstoppable Apps!!!");
    });

    it("Should allow setting a new message", async function () {
      const newGreeting = "Learn Scaffold-ETH 2! :)";

      await registrar.setGreeting(newGreeting);
      expect(await registrar.greeting()).to.equal(newGreeting);
    });
  });
});
