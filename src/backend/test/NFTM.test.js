const { expect } = require("chai");

describe("NFTMarketplace", async () => {
  let deployer, add1, add2, nft, marketplace;
  let feepercent = 1;
  let URI='sample URL'

  beforeEach(async () => {
    const NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");
    [deployer, add1, add2] = await ethers.getSigners();
    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feepercent);
  });

  describe("Deployment", () => {
    it("should initialize the setup very important NFT", async () => {
      expect(await nft.name()).to.equal("DApp NFT");
      expect(await nft.symbol()).to.equal("DApp");
    });
    it("should initialize the setup very important Marketplace", async () => {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feepercent);
    });
  });

  describe("Minting NFTS", () => {
    it("should track minting NFT", async () => {
        await  nft.connect(add1).mint(URI);
        expect(await nft.tokenCount()).to.equal(1);
        expect(await nft.balanceOf(add1.address)).to.equal(1);
        expect(await nft.tokenURI(1)).to.equal(URI);
        await  nft.connect(add2).mint(URI);
        expect(await nft.tokenCount()).to.equal(2);
        expect(await nft.balanceOf(add2.address)).to.equal(1);
        expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });
});
