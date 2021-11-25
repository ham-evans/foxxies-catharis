import { ethers } from "hardhat";

import verify from "./verify";

const deployAndVerify = async (
  contractName: string,
  ...constructorArguments: any
) => {
  const CONTRACT = await ethers.getContractFactory(contractName);
  const contract = await CONTRACT.deploy(...constructorArguments);

  const { blockNumber } = await contract.deployTransaction.wait();

  console.log(`Contract ${contractName} deployed to:`, contract.address);

  verify(contract, blockNumber, constructorArguments);
};

export default deployAndVerify;
