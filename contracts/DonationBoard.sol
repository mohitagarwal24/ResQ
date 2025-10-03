// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DonationBoard {
    struct Bounty {
        uint256 id;
        string title;
        string description;
        uint256 goalAmountWei;
        uint256 currentAmountWei;
        string location;
        address organizer;
        string organizerName;
        string imageUrl;
        string proofIpfsHash;
        Status status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    enum Status {
        Open,
        ProofPending,
        Completed
    }

    uint256 public nextBountyId = 1;
    mapping(uint256 => Bounty) public bounties;
    uint256[] public bountyIds;

    event BountyCreated(uint256 indexed id, address indexed organizer, string title, uint256 goalAmountWei);
    event Donated(uint256 indexed id, address indexed donor, uint256 amountWei);
    event ProofSubmitted(uint256 indexed id, string ipfsHash);
    event FundsReleased(uint256 indexed id, address indexed to, uint256 amountWei);

    modifier onlyOrganizer(uint256 bountyId) {
        require(bounties[bountyId].organizer == msg.sender, "Not organizer");
        _;
    }

    function createBounty(
        string memory title,
        string memory description,
        uint256 goalAmountWei,
        string memory location,
        string memory organizerName,
        string memory imageUrl
    ) external returns (uint256 id) {
        require(goalAmountWei > 0, "Invalid goal");
        id = nextBountyId++;
        Bounty storage b = bounties[id];
        b.id = id;
        b.title = title;
        b.description = description;
        b.goalAmountWei = goalAmountWei;
        b.location = location;
        b.organizer = msg.sender;
        b.organizerName = organizerName;
        b.imageUrl = imageUrl;
        b.status = Status.Open;
        b.createdAt = block.timestamp;
        b.updatedAt = block.timestamp;
        bountyIds.push(id);
        emit BountyCreated(id, msg.sender, title, goalAmountWei);
    }

    function donate(uint256 bountyId) external payable {
        Bounty storage b = bounties[bountyId];
        require(b.organizer != address(0), "Bounty not found");
        require(b.status == Status.Open, "Not open");
        require(msg.value > 0, "No value");
        b.currentAmountWei += msg.value;
        b.updatedAt = block.timestamp;
        emit Donated(bountyId, msg.sender, msg.value);
    }

    function submitProof(uint256 bountyId, string memory ipfsHash) external onlyOrganizer(bountyId) {
        Bounty storage b = bounties[bountyId];
        require(b.organizer != address(0), "Bounty not found");
        require(b.status == Status.Open, "Invalid status");
        require(bytes(ipfsHash).length > 0, "Empty proof");
        b.proofIpfsHash = ipfsHash;
        b.status = Status.ProofPending;
        b.updatedAt = block.timestamp;
        emit ProofSubmitted(bountyId, ipfsHash);
    }

    function releaseFunds(uint256 bountyId, bool verified) external onlyOrganizer(bountyId) {
        // In production, `verified` should come from an oracle/validator, not organizer.
        Bounty storage b = bounties[bountyId];
        require(b.organizer != address(0), "Bounty not found");
        require(b.status != Status.Completed, "Already released");
        require(b.currentAmountWei > 0, "Nothing to release");

        // Simplified: require verified flag to be true (placeholder for oracle/AI validation).
        require(verified, "Not verified");

        uint256 amount = b.currentAmountWei;
        b.currentAmountWei = 0;
        b.status = Status.Completed;
        b.updatedAt = block.timestamp;
        (bool ok, ) = b.organizer.call{value: amount}("");
        require(ok, "Transfer failed");
        emit FundsReleased(bountyId, b.organizer, amount);
    }

    // Views
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId];
    }

    function getAllBounties() external view returns (Bounty[] memory) {
        uint256 len = bountyIds.length;
        Bounty[] memory arr = new Bounty[](len);
        for (uint256 i = 0; i < len; i++) {
            arr[i] = bounties[bountyIds[i]];
        }
        return arr;
    }
}


