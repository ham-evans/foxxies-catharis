// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface PixelFoxxies is IERC721Enumerable {
    event WhiteListConfigChanged(address whitelistSigner, uint32 startTime, uint32 endTime);
    event IsBurnEnabledChanged(bool newIsBurnEnabled);
    event BaseURIChanged(string newBaseURI);
    event WhiteListMint(address minter, uint256 count);

    // Both structs fit in a sinkgle storage slot for gas optimization
    struct WhiteListConfig {
        address whitelistSigner;
        uint32 startTime;
        uint32 endTime;
    }
 
    function setUpWhiteList(
        address whitelistSigner,
        uint256 startTime,
        uint256 endTime
    ) external;


    function setIsBurnEnabled(bool _isBurnEnabled) external;


    function setBaseURI(string calldata newbaseURI) external;

    function mintWhiteListTokens(
        uint256 count,
        uint256 maxCount,
        bytes calldata signature
    ) external payable;


    function burn(uint256 tokenId) external;
}