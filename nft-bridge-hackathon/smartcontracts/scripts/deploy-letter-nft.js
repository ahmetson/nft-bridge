require('dotenv').config()

async function main() {
    
    // We get the contract to deploy
    const Letter = await ethers.getContractFactory("LetterNft");
    const letter = await Letter.deploy();
  
    console.log("Letter NFT to:", letter.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
