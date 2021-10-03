require('dotenv').config()

async function main() {
    
    const wrapped = process.env.WRAPPED_NFT; // Scape NFT as the source

    // We get the contract to deploy
    const Bridged = await ethers.getContractFactory("BridgedNft");
    const bridged = await Bridged.deploy(wrapped);
  
    console.log("Deployed Bridged Scape NFT to:", bridged.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
