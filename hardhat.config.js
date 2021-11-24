require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  paths: { 
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: { 
      url: String(process.env.INFURA_API_ROPSTEN_KEY),
      accounts: [process.env.PRIVATE_KEY]
    }, 
    rinkeby: { 
      url: String(process.env.INFURA_API_RINKEBY_KEY),
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: String(process.env.ETHERSCAN_API_KEY)
  }
};
