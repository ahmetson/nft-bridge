const { ethers } = require('hardhat');

require('dotenv').config()

async function main() {
    // We get the contract to deploy
    const Bridged = await ethers.getContractFactory("BridgedNft");
    const bridged = await Bridged.attach(process.env.TARGET_BRIDGED);

    // let oracle = process.env.TARGET_ORACLE;
    // let oracleTx = await bridged.setOracle(oracle);
    // await oracleTx.wait();

    // console.log(`Oracle was set to ${oracleTx.transactionHash}`);

    // let jobId = '00000000000000000000000000000000' + process.env.TARGET_JOB_ID;
    // console.log(`'${jobId}'`);
    // let jobTx = await bridged.setJobId(ethers.utils.arrayify('0x'+jobId));
    // await jobTx.wait();

    // console.log(`Job Id was set`);

    let linkFee = ethers.utils.parseEther('1') // 1LINK is Minimum Threshold
    let feeTx = await bridged.setFee(linkFee);
    await feeTx.wait();

    console.log(`LINK Fee was set`);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
