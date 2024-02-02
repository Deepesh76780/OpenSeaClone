const { expect } = require("chai");

describe("NFTMarketplace", async () => {
  let deployer, add1, add2, nft, marketplace;
  let feepercent = 1;
  let URI = "sample URL";
  const toWei = (num) => ethers.utils.parseEther(num.toString());
  const fromWei = (num) => ethers.utils.formatEther(num);

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
      await nft.connect(add1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(add1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      await nft.connect(add2).mint(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(add2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("market marketplace Items", () => {
    beforeEach(async () => {
      await nft.connect(add1).mint(URI);
      await nft.connect(add1).setApprovalForAll(marketplace.address, true);
    });

    it("should track ", async () => {
      await expect(
        marketplace.connect(add1).makeItems(nft.address, 1, toWei(1))
      )
        .to.emit(marketplace, "Offered")
        .withArgs(1, nft.address, 1, toWei(1), add1.address);

      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      expect(await marketplace.itemCount()).to.equal(1);

      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(toWei(1));
      expect(item.sold).to.equal(false);
    });

    it("should fail if price is set to zero", async () => {
      await expect(
        marketplace.connect(add1).makeItems(nft.address, 1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });
  });
});
