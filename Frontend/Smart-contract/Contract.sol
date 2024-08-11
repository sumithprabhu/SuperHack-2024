// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StartupInvestmentPlatform is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256) public userIDs;
    mapping(address => uint256) public founderIDs;
    mapping(address => uint256[]) private ownedNFTs;

    struct PaymentDetails {
        uint256 amount;
        address recipient;
        bool isClaimed;
    }

    mapping(uint256 => PaymentDetails) public paymentDetails;

    // Define an event that logs the minting of a new NFT
    event NFTMinted(uint256 indexed newItemId, address indexed owner);
    event FundsClaimed(uint256 indexed newItemId, address indexed founder);
    event FundsReverted(uint256 indexed newItemId, address indexed user);

    constructor() ERC721("RaiseCoin", "RC") {}

    // Users register themselves
    function registerUser(uint256 userID) public {
        require(userIDs[msg.sender] == 0, "User already registered.");
        userIDs[msg.sender] = userID;
    }

    // Founders register themselves
    function registerFounder(uint256 founderID) public {
        require(founderIDs[msg.sender] == 0, "Founder already registered.");
        founderIDs[msg.sender] = founderID;
    }

    // Check if a user is registered
    function isUserRegistered(address userAddress) public view returns (bool) {
        return userIDs[userAddress] != 0;
    }

    // Check if a founder is registered
    function isFounderRegistered(address founderAddress) public view returns (bool) {
        return founderIDs[founderAddress] != 0;
    }

    function getUserID(address userAddress) public view returns (uint256) {
        return userIDs[userAddress];
    }

    function getFounderID(address founderAddress) public view returns (uint256) {
        return founderIDs[founderAddress];
    }

    function mintNFT(string memory tokenURI, uint256 paymentAmount, address recipientAddress) public payable returns (uint256) {
        require(msg.value >= paymentAmount, "Insufficient funds sent.");

        // Mint the NFT to the caller's address
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        ownedNFTs[msg.sender].push(newItemId);

        // Store payment details
        paymentDetails[newItemId] = PaymentDetails({
            amount: paymentAmount,
            recipient: recipientAddress,
            isClaimed: false
        });

        // Emit the event with the new token ID
        emit NFTMinted(newItemId, msg.sender);

        return newItemId;
    }

    function getOwnedNFTs(address owner) public view returns (uint256[] memory) {
        return ownedNFTs[owner];
    }

    function claimFunds(uint256 tokenId) public {

        require(!paymentDetails[tokenId].isClaimed, "Funds already claimed.");

        PaymentDetails storage payment = paymentDetails[tokenId];
        payment.isClaimed = true;

        // Transfer the funds to the recipient address
        payable(payment.recipient).transfer(payment.amount);

        // Emit the event with the token ID
        emit FundsClaimed(tokenId, msg.sender);
    }

    function revertFunds(uint256 tokenId) public {

        require(!paymentDetails[tokenId].isClaimed, "Funds already claimed.");

        PaymentDetails storage payment = paymentDetails[tokenId];

        // Transfer the funds back to the user
        payable(ownerOf(tokenId)).transfer(payment.amount);

        // Mark as claimed to prevent double-spending
        payment.isClaimed = true;

        // Emit the event with the token ID
        emit FundsReverted(tokenId, msg.sender);
    }
    // Receive function to accept plain Ether transfers
    receive() external payable {}
}
