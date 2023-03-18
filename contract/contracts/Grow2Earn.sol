// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import {Base64} from "./libraries/Base64.sol";

contract Grow2Earn is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string[] baseURIs;
    address[] minters;
    bool[] isValid;
    struct Record {
        string imageURI;
        string animationURI;
        uint256 timestamp;
    }
    mapping(uint256 => Record[]) record;

    event NewAgaveNFTMinted(address sender, uint256 tokenId);
    event TokenURIUpdated(address sender, uint256 tokenId);
    event TokenURISwitched(address sender, uint256 tokenId, uint256 index);
    event TokenURIRedeemed(address sender, uint256 tokenId);

    constructor() ERC721("METAPLANTS NFT ALPHA", "METAPLANTS ALPHA") {
        console.log("This is my NFT contract.");
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

    function makeAgaveNFT(
        string memory imageURI,
        string memory animationURI,
        string memory name,
        string memory description
    ) public {
        // mint a new NFT having metadata with imageURI (image path) and animationURI (3D model path)
        uint256 newtokenId = _tokenIds.current();
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
        _safeMint(msg.sender, newtokenId);
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
        emit NewAgaveNFTMinted(msg.sender, newtokenId);
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
        emit TokenURIUpdated(msg.sender, tokenId);
    }

    function switchTokenURI(uint256 tokenId, uint256 index) public {
        // select metadata from existing record
        require(tokenId <= _tokenIds.current() - 1, "Over existing tokenId");
        require(
            index <= record[tokenId].length - 1,
            "Over existing record length"
        );
        require(
            msg.sender == ownerOf(tokenId),
            "Only holder can switch metadata"
        );
        _setTokenURI(
            tokenId,
            makeTokenURI(
                record[tokenId][index].imageURI,
                record[tokenId][index].animationURI,
                baseURIs[tokenId]
            )
        );
        emit TokenURISwitched(msg.sender, tokenId, index);
    }

    function redeem(uint256 tokenId) public {
        // redeem NFT (make NFT invalid)
        require(tokenId <= _tokenIds.current() - 1, "Over existing tokenId");
        require(msg.sender == ownerOf(tokenId), "Only owner can redeem");
        require(isValid[tokenId], "Token is invalid");
        isValid[tokenId] = false;
        emit TokenURIRedeemed(msg.sender, tokenId);
    }

    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) internal view override {
    //     // mintは許可（そのまま処理を通す）
    //     // transferは禁止（処理を中断させる）
    //     require(from == address(0) || isValid[tokenId], "blocked transfer");
    //     super._beforeTokenTransfer(from, to, tokenId);
    // }

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
