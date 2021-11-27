// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './foxxies/token-types.sol';
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IFXC is IERC721Enumerable {
      function burn(uint256 tokenId) external;

  function getTokensByOwner(address owner) external view returns(uint256[] memory);

  function walletOfOwner(address owner) external view returns(uint256[] memory);

  //external payable
  fallback() external payable;
  receive() external payable;

  //onlyDelegates
  function setBaseURI(string calldata _newBaseURI, string calldata _newSuffix) external;

  function mint( address to, TOKEN_TYPES tokenType ) external;

  //public
  function tokenURI(uint tokenId) external view returns (string memory);
}
