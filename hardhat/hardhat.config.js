require("dotenv").config()
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-foundry");

const { MAINNET_RPC_URL, MAINNET_PRIVATE_KEY } = process.env;


module.exports = {
  solidity: "0.8.13",
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: MAINNET_PRIVATE_KEY ? [`0x${MAINNET_PRIVATE_KEY}`] : [],
    }
  }
};

