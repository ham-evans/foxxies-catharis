// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

import verify from "./utils/verify";

async function main() {
  const FXC = await ethers.getContractFactory("FXC");
  const fxc = await FXC.deploy();

  const { blockNumber } = await fxc.deployTransaction.wait();

  console.log(`Contract FXC deployed to:`, fxc.address);

  verify(fxc, blockNumber);

  const FXCSale = await ethers.getContractFactory("FXCSale");
  const fxcsale = await FXCSale.deploy(
    [
      "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
      "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
    ],
    fxc.address
  );

  const { blockNumber: fxcsaleBlockNumber } =
    await fxcsale.deployTransaction.wait();

  fxc.setDelegate(fxcsale.address, true);

  console.log(`Contract FXCSale deployed to:`, fxcsale.address);

  verify(fxcsale, fxcsaleBlockNumber, [
    [
      "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
      "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
    ],
    fxc.address,
  ]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
