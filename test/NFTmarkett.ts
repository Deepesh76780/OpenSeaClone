
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("NFTmarket",()=>{
  
    async function deployOneYearLockFixture() {
    const nftmarket = await ethers.deployContract("NFTMarket");
    await nftmarket.waitForDeployment();
    return { nftmarket};
  }

    describe("Deployment", function () {
      it("passing Url and getting Token Id", async function () {
        const { nftmarket } = await deployOneYearLockFixture();
        const tokenURI = "https://ipfs.io/ipfs/QmXu3v8z1z3Z"
        const transaction = await nftmarket.createNFT(tokenURI)
        const receipt = await transaction.wait()
        // token Id not found
        console.log(receipt)
      });
  });

  





});

