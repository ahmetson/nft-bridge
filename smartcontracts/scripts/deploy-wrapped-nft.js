require('dotenv').config()

async function main() {
    
    const source = process.env.SCAPE_NFT; // Scape NFT as the source

    // We get the contract to deploy
    const Wrapped = await ethers.getContractFactory("WrappedNft");
    const wrapped = await Wrapped.deploy(source);
  
    console.log("Deployed Wrapped Scape NFT to:", wrapped.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
