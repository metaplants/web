// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import {Base64} from "./libraries/Base64.sol";

contract MetaplantsFree is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string[] baseURIs;
    address[] minters;
    bool[] isValid;
    mapping(uint256 => string) private _tokenURIs;
    struct Record {
        string imageURI;
        string animationURI;
        uint256 timestamp;
    }
    mapping(uint256 => Record[]) record;

    event Mint(address sender, uint256 tokenId);
    event UpdateTokenURI(address sender, uint256 tokenId);
    event SafeBatchDistributeFrom(
        address,
        address[],
        uint256[],
        uint256[],
        bytes
    );

    constructor() ERC1155("") {
        console.log("This is my NFT contract.");
    }

    function mint(
        string memory imageURI,
        string memory animationURI,
        string memory name,
        string memory description,
        uint256 amount
    ) public {
        // mint a new ERC1155 NFT having metadata with imageURI (image path) and animationURI (3D model path)
        uint256 newtokenId = _tokenIds.current(); // TODO minterの制限を入れる
        string memory newBaseURI = string(
            abi.encodePacked(
                '"name": "',
                name,
                '", "description": "',
                description,
                '"'
            )
        );
        string memory newTokenURI = makeTokenURI(
            imageURI,
            animationURI,
            newBaseURI
        );
        _mint(msg.sender, newtokenId, amount, "");
        _setTokenURI(newtokenId, newTokenURI);
        record[newtokenId].push(
            Record(imageURI, animationURI, block.timestamp)
        );
        baseURIs.push(newBaseURI);
        minters.push(msg.sender);
        isValid.push(true);
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
        string memory animationURI
    ) public {
        // update metadata and add record
        require(tokenId <= _tokenIds.current() - 1, "Over existing tokenId");
        require(
            msg.sender == minters[tokenId],
            "Only minter can update metadata"
        );
        require(isValid[tokenId], "Token is invalid");
        _setTokenURI(
            tokenId,
            makeTokenURI(imageURI, animationURI, baseURIs[tokenId])
        );
        record[tokenId].push(Record(imageURI, animationURI, block.timestamp));
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
        string memory baseURI
    ) private pure returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        "{",
                        baseURI,
                        ', "image": "',
                        imageURI,
                        '", "animation_url": "',
                        animationURI,
                        '"}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getIsValid(uint256 tokenId) public view returns (bool) {
        return isValid[tokenId];
    }

    function getCounter() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getMinter(uint256 tokenId) public view returns (address) {
        return minters[tokenId];
    }

    function getRecord(uint256 tokenId) public view returns (Record[] memory) {
        return record[tokenId];
    }
}