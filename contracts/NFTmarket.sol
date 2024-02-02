// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFTMarket is ERC721URIStorage{

    uint256 private _nextTokenId = 0;
    constructor() ERC721("DeepSea", "DSNFT") {}

    function createNFT(string memory tokenURI) public returns(uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    } 
    


    

}
