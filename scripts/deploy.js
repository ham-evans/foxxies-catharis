const hre = require("hardhat");

async function main () { 
    const Allymals = await hre.ethers.getContractFactory("Allymals");
    const allymals = await Allymals.deploy()
    await allymals.deployed();
    console.log("Allymals deployed to ", allymals.address);
}

main ()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });