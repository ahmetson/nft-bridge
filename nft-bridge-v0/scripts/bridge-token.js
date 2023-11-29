require('dotenv').config()

async function main() {
    // We get the contract to deploy
    const Bridged = await ethers.getContractFactory("BridgedNft");
    const bridged = await Bridged.attach(process.env.TARGET_BRIDGED);

    let tokenId = 2709;

    let mintTx = await bridged.mint(tokenId);
    await mintTx.wait();

    console.log(`Mint was send`);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
