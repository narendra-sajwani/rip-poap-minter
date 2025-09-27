// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IERC20} from "./interfaces/IERC20.sol";

error InvalidEventId();
error EventNotActive();
error AlreadyMinted();
error TokenTransferFailed();
error NoTokensToWithdraw();
error TokenDoesNotExist();

contract RIFPoap is ERC721URIStorage, Ownable(msg.sender), ReentrancyGuard {
    IERC20 private immutable RIF_TOKEN;
    uint256 private _tokenIdCounter;
    uint256 private _eventIdCounter;
    
    uint256 public constant MINT_PRICE = 10 * 10**18; // 10 RIF tokens
    
    struct Event {
        string name;
        string description;
        string imageURI;
        uint256 startDate;
        uint256 endDate;
        bool active;
        uint256 totalMinted;
    }
    
    mapping(uint256 => Event) public events;
    mapping(address => mapping(uint256 => bool)) public hasAttended;
    mapping(uint256 => uint256) public tokenToEvent;
    
    event EventCreated(uint256 indexed eventId, string name, string imageURI);
    event POAPMinted(address indexed recipient, uint256 indexed tokenId, uint256 indexed eventId);
    event EventToggled(uint256 indexed eventId, bool active);

    constructor(address _rifTokenAddress) ERC721("RIF POAP", "RIFPOAP") {
        RIF_TOKEN = IERC20(_rifTokenAddress);
        
        // Create ETHGlobal New Delhi event automatically
        _eventIdCounter = 1;
        uint256 eventId = _eventIdCounter;
        
        events[eventId] = Event({
            name: "ETHGlobal New Delhi 2025",
            description: "Proof of attendance for ETHGlobal New Delhi hackathon",
            imageURI: "https://gateway.pinata.cloud/ipfs/QmETHGlobalNewDelhi2025",
            startDate: 1727424000, // Sept 27, 2025
            endDate: 1727596800,   // Sept 29, 2025
            active: true,
            totalMinted: 0
        });
        
        emit EventCreated(eventId, "ETHGlobal New Delhi 2025", events[eventId].imageURI);
    }
    
    function createEvent(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _startDate,
        uint256 _endDate
    ) external onlyOwner {
        _eventIdCounter++;
        uint256 eventId = _eventIdCounter;
        
        events[eventId] = Event({
            name: _name,
            description: _description,
            imageURI: _imageURI,
            startDate: _startDate,
            endDate: _endDate,
            active: true,
            totalMinted: 0
        });
        
        emit EventCreated(eventId, _name, _imageURI);
    }
    
    function mintPOAP(uint256 _eventId) external nonReentrant {
        if (_eventId == 0 || _eventId > _eventIdCounter) revert InvalidEventId();
        if (!events[_eventId].active) revert EventNotActive();
        if (hasAttended[msg.sender][_eventId]) revert AlreadyMinted();
        
        // Transfer RIF tokens from user to contract
        if (!RIF_TOKEN.transferFrom(msg.sender, address(this), MINT_PRICE)) {
            revert TokenTransferFailed();
        }
        
        // Mint NFT
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(msg.sender, tokenId);
        
        // Update mappings
        hasAttended[msg.sender][_eventId] = true;
        tokenToEvent[tokenId] = _eventId;
        events[_eventId].totalMinted++;
        
        emit POAPMinted(msg.sender, tokenId, _eventId);
    }
    
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        if (_tokenId == 0 || _tokenId > _tokenIdCounter) revert TokenDoesNotExist();
        
        uint256 eventId = tokenToEvent[_tokenId];
        Event memory eventData = events[eventId];
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(abi.encodePacked(
                "{\"name\":\"", eventData.name, " POAP\",",
                "\"description\":\"", eventData.description, "\",",
                "\"image\":\"", eventData.imageURI, "\",",
                "\"attributes\":[",
                    "{\"trait_type\":\"Event\",\"value\":\"", eventData.name, "\"},",
                    "{\"trait_type\":\"Token ID\",\"value\":\"", _toString(_tokenId), "\"}",
                "]}"
            )))
        ));
    }
    
    function getAllEvents() external view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](_eventIdCounter);
        for (uint256 i = 1; i <= _eventIdCounter; i++) {
            allEvents[i-1] = events[i];
        }
        return allEvents;
    }
    
    function getUserPOAPsForEvent(address _user, uint256 _eventId) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(_user);
        uint256[] memory userTokens = new uint256[](balance);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (i <= _tokenIdCounter && ownerOf(i) == _user && tokenToEvent[i] == _eventId) {
                userTokens[currentIndex] = i;
                currentIndex++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](currentIndex);
        for (uint256 i = 0; i < currentIndex; i++) {
            result[i] = userTokens[i];
        }
        
        return result;
    }
    
    function withdrawRIF() external onlyOwner {
        uint256 balance = RIF_TOKEN.balanceOf(address(this));
        if (balance == 0) revert NoTokensToWithdraw();
        if (!RIF_TOKEN.transfer(owner(), balance)) revert TokenTransferFailed();
    }
    
    function getCounters() external view returns (uint256 eventCount, uint256 tokenCount) {
        return (_eventIdCounter, _tokenIdCounter);
    }
    
    // Internal helper function
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
