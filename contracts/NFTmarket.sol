// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/access/Ownable.sol";

struct NFTListing {
    uint256 price;
    address owner;
}

contract NFTMarket is ERC721URIStorage , Ownable{
    uint256 private _nextTokenId = 0;
    using Math for uint256;
    mapping(uint256 => NFTListing) private _listing;
    event NFTTransfer(
        uint256 tokenId,
        address to,
        string tokenURI,
        uint256 price
    );

    constructor() ERC721("DeepSea", "DSNFT") {}

    function createNFT(string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit NFTTransfer(tokenId, msg.sender, tokenURI, 0);
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(price > 0, "Price must be greater than 0");
        approve(address(this), tokenId);
        transferFrom(msg.sender, address(this), tokenId);
        _listing[tokenId] = NFTListing(price, msg.sender);
        emit NFTTransfer(tokenId, address(this), "", price);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(_listing[tokenId].price > 0, "NFT not listed");
        require(msg.value >= _listing[tokenId].price, "Insufficient funds");
        transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
        payable(msg.sender).transfer(
            _listing[tokenId].price.tryMul(95).tryDiv(100)
        );
        emit NFTTransfer(tokenId, msg.sender, "", 0);
    }

    function cancelListing(uint256 tokenId) public {
        require(_listing[tokenId].price > 0, "Error message");
        require(_listing[tokenId].owner == msg.sender, "Not the owner");
        transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
        emit NFTTransfer(tokenId, msg.sender, "", 0);
    }

    function withdraw() public onlyOwner{
        payable(owner()).transfer(address(this).balance);
    }

    function clearListing(uint256 tokenId) private {
        _listing[tokenId] = NFTListing(0, address(0));
    }
}
