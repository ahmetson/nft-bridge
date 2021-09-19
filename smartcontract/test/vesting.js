const { expect } = require("chai");
const { ethers } = require("hardhat");

let polka;
let vesting;
let startTime;
let secondOffset = 2;
let vestingDuration;
const SECONDS_PER_DAY = 86400;
let reward = 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Vesting", function () {
  it("addVestingPeriod", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Polka = await ethers.getContractFactory("Polka");
    polka = await Polka.deploy();
    await polka.deployed();

    expect(await polka.balanceOf(owner.address)).to.equal("1000000000000000000000000");
    expect(await polka.decimals()).to.equal(18);

    const Vesting = await ethers.getContractFactory("Vesting");
    vesting = await Vesting.deploy(polka.address);
    await vesting.deployed();

    /// Params
    startTime = parseInt(new Date().getTime() / 1000 ) + secondOffset;
    vestingDuration = 100;
    const vestingPeriodTx = await vesting.addVestingPeriod(startTime, vestingDuration);

    // wait until the transaction is mined
    await vestingPeriodTx.wait();

    let pool = await vesting.pool();
    expect(pool.startTime).to.equal(startTime);
    expect(pool.vestingDuration).to.equal(vestingDuration);
  });

  it("addTokenGrants", async function () {
    const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    let grantAmount = 5;
    let recipient = [
      addr1.address,
      addr2.address,
      addr3.address,
      addr4.address,
      addr5.address
    ];
    let amount = [
      "1000000000000000000000",
      "1000000000000000000000",
      "1000000000000000000000",
      "1000000000000000000000",
      "1000000000000000000000"
    ];

    let approveTx = await polka.approve(vesting.address, "5000000000000000000000");
    await approveTx.wait();

    let addTokenGrantsTx = await vesting.addTokenGrants(grantAmount, recipient, amount);
    await addTokenGrantsTx.wait();

    let grant1 = await vesting.tokenGrants(addr1.address);
    expect(grant1.amount).to.equal("1000000000000000000000");
    
  });

  it("calculateGrantClaim", async function () {
    const [owner, addr1] = await ethers.getSigners();

    await sleep((secondOffset + 3) * 1000);

    let now = await vesting.getNow();
    let passedSeconds = now - (startTime);

    let perSecond = 1000 / vestingDuration;
    let amountVested = passedSeconds * perSecond;

    let totalClaimed = 0;
    let claimableAmount = amountVested - (totalClaimed);

    let calculatedClaimable = await vesting.calculateGrantClaim(addr1.address);
    expect(calculatedClaimable/1e18).to.equal(claimableAmount);
    totalClaimed += claimableAmount;

    let claimTx = await vesting.claimVestedTokens(addr1.address);
    await claimTx.wait();

    // We get claimed amount from contract, instead calculating locally.
    // Because, claiming tokens would take some time, so could be higher number than in local calculation.
    let claimed = await vesting.claimedBalance(addr1.address);

    // We add one second at the end, because claiming token will take that amount of time.
    let newNow = await vesting.getNow();
    let newPassedSeconds = newNow - (startTime);
    let newAmountVested = newPassedSeconds * perSecond - claimed/1e18;

    let newClaimable = await vesting.calculateGrantClaim(addr1.address);
    expect(newClaimable/1e18).to.equal(newAmountVested);
  });
});