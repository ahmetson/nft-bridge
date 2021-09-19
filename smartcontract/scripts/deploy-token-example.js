async function main() {
    // We get the contract to deploy
    const Polka = await ethers.getContractFactory("Polka");
    const polka = await Polka.deploy();
  
    console.log("XP example token deployed to:", polka.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
