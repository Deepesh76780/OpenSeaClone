require("@nomiclabs/hardhat-waffle");

const API_KEY="WTA9_FSivrh9WxrwKhb1pv4DtCQQdhCv";
const SEPOLIA_PRIVATE_KEY="a8db26aa29da236ec52f34f5361a836acf86ad1b0d18bbfe36361b14996dd373";

module.exports = {
  solidity: "0.8.4",
  paths:{
    artifacts: './src/backend/artifacts',
    sources: './src/backend/contracts',
    cache: './src/backend/cache',
    tests: './src/backend/test'
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
