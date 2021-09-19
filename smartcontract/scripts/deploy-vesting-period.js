require('dotenv').config()

async function main() {
    
    const STARTING_TIME = 1631731978 + 300; // starting time in unix timestamp
    // const DURATION = 23328000;        // Private sale - 9 months period of vesting in seconds
    const DURATION = 7776000;           // ChainGuardian, TrustPad - 3 months of vesting period

    // We get the contract to deploy
    const Vesting = await ethers.getContractFactory("VestingPeriod");
    const vesting = await Vesting.deploy(process.env.RINKEBY_POLKA, STARTING_TIME, DURATION);
  
    console.log("Vesting Period deployed to:", vesting.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
