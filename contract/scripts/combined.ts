import { ethers } from "hardhat";

import verify from "./utils/verify";

async function main() {
  const FXC = await ethers.getContractFactory("FXCCombined");
  const fxc = await FXC.deploy([
    "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
    "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
  ]);

  const tx = await fxc.deployTransaction.wait();

  console.log(`Contract FXC deployed to:`, fxc.address);
  console.log(`Transaction:`, tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
