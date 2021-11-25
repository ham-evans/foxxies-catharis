import { Contract } from "@ethersproject/contracts";
import { ethers, run } from "hardhat";

const verify = async <T extends Contract>(
  contract: T,
  deployBlockNumber: number,
  constructorArguments?: any[]
) => {
  if (!deployBlockNumber) {
    throw new Error(
      "Contract deployment transaction block number is not defined."
    );
  }

  console.log("Waiting for 10 confirmations");

  let count = 0;
  while (count < 10) {
    console.log("Monitoring confirmations...");

    await new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        const latestBlock = await ethers.provider.getBlockNumber();
        count = latestBlock - deployBlockNumber;
        console.log("Confirmations: ", count);
        resolve();
      }, 10000);
    });
  }

  await run("verify:verify", {
    address: contract.address,
    constructorArguments,
  });
};

export default verify;
