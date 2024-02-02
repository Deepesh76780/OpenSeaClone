require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  path:{
    artifacts: './src/backend/artifacts',
    sources: './src/backend/contracts',
    cache: './src/backend/cache',
    tests: './src/backend/test'
  }
};
