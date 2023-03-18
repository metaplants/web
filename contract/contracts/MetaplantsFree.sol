// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import {Base64} from "./libraries/Base64.sol";

contract MetaplantsFree is ERC1155, Ownable, ERC2981, DefaultOperatorFilterer {
    string public name;
    string public symbol;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;

    event Mint(address sender, uint256 tokenId);
    event UpdateTokenURI(address sender, uint256 tokenId);
    event SafeBatchDistributeFrom(
        address,
        address[],
        uint256[],
        uint256[],
        bytes
    );

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC1155("") Ownable() {
        name = name_;
        symbol = symbol_;
        _setDefaultRoyalty(owner(), 1000);
        console.log("Deploying a MetaplantsFree contract");
    }

    function mint(
        string memory imageURI,
        string memory animationURI,
        string memory backgroundColor,
        string memory name,
        string memory description,
        uint256 amount
    ) public onlyOwner {
        // mint a new ERC1155 NFT having metadata with imageURI (image path) and animationURI (3D model path)
        uint256 newtokenId = _tokenIds.current();
        _mint(msg.sender, newtokenId, amount, "");
        _setTokenURI(
            newtokenId,
            makeTokenURI(
                imageURI,
                animationURI,
                backgroundColor,
                name,
                description
            )
        );
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newtokenId,
            msg.sender
        );
        _tokenIds.increment();
        emit Mint(msg.sender, newtokenId);
    }

    function updateTokenURI(
        uint256 tokenId,
        string memory imageURI,
        string memory animationURI,
        string memory backgroundColor,
        string memory name,
        string memory description
    ) public onlyOwner {
        // update metadata
        require(tokenId <= _tokenIds.current() - 1, "Over existing tokenId");
        _setTokenURI(
            tokenId,
            makeTokenURI(
                imageURI,
                animationURI,
                backgroundColor,
                name,
                description
            )
        );
        emit UpdateTokenURI(msg.sender, tokenId);
    }

    function safeBatchDistributeFrom(
        address from,
        address[] memory toAddresses,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        for (uint256 i = 0; i < toAddresses.length; ++i) {
            safeBatchTransferFrom(from, toAddresses[i], ids, amounts, data);
        }
        emit SafeBatchDistributeFrom(
            msg.sender,
            toAddresses,
            ids,
            amounts,
            data
        );
    }

    //override ERC1155
    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_tokenURIs[tokenId]);
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) private {
        _tokenURIs[tokenId] = tokenURI;
    }

    // generate tokenURI string from imageURI, animationURI, name, and description
    function makeTokenURI(
        string memory imageURI,
        string memory animationURI,
        string memory backgroundColor,
        string memory name,
        string memory description
    ) private pure returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": ',
                        name,
                        ', "description": "',
                        description,
                        ', "image": "',
                        imageURI,
                        '", "animation_url": "',
                        animationURI,
                        '", "background_color": "',
                        backgroundColor,
                        '"}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getCounter() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getMinter(uint256 tokenId) public view returns (address) {
        return minters[tokenId];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }

    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function resetTokenRoyalty(uint256 tokenId) external onlyOwner {
        _resetTokenRoyalty(tokenId);
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) public override onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override onlyAllowedOperator(from) {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
