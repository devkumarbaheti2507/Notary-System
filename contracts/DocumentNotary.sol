// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title DocumentNotary
 * @dev Cross-Chain Document Notary System
 *      Allows users to notarize documents by storing their hash on-chain.
 *      Supports document verification, ownership transfer, and revocation.
 */
contract DocumentNotary {

    // ─── Structs ────────────────────────────────────────────────────────────

    struct Document {
        bytes32  docHash;        // SHA-256 hash of the document
        address  owner;          // Current owner / notarizer
        uint256  timestamp;      // When it was notarized
        string   metadata;       // Optional description / filename
        bool     isRevoked;      // Has the owner revoked it?
        uint256  chainId;        // Chain ID where it was notarized
    }

    // ─── State ───────────────────────────────────────────────────────────────

    // docHash → Document
    mapping(bytes32 => Document) private documents;

    // owner → list of their doc hashes
    mapping(address => bytes32[]) private ownerDocuments;

    // Total count of notarized docs
    uint256 public totalDocuments;

    // ─── Events ──────────────────────────────────────────────────────────────

    event DocumentNotarized(
        bytes32 indexed docHash,
        address indexed owner,
        uint256 timestamp,
        string  metadata,
        uint256 chainId
    );

    event DocumentRevoked(
        bytes32 indexed docHash,
        address indexed owner,
        uint256 timestamp
    );

    event OwnershipTransferred(
        bytes32 indexed docHash,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    // ─── Modifiers ───────────────────────────────────────────────────────────

    modifier onlyOwner(bytes32 _docHash) {
        require(documents[_docHash].owner == msg.sender, "Not the document owner");
        _;
    }

    modifier documentExists(bytes32 _docHash) {
        require(documents[_docHash].timestamp != 0, "Document not found");
        _;
    }

    modifier notRevoked(bytes32 _docHash) {
        require(!documents[_docHash].isRevoked, "Document has been revoked");
        _;
    }

    // ─── Core Functions ──────────────────────────────────────────────────────

    /**
     * @dev Notarize a document by storing its hash on-chain.
     * @param _docHash  SHA-256 hash of the document (bytes32)
     * @param _metadata Optional description / filename string
     */
    function notarizeDocument(bytes32 _docHash, string memory _metadata) external {
        require(_docHash != bytes32(0), "Invalid document hash");
        require(documents[_docHash].timestamp == 0, "Document already notarized");

        uint256 currentChainId;
        assembly { currentChainId := chainid() }

        documents[_docHash] = Document({
            docHash:   _docHash,
            owner:     msg.sender,
            timestamp: block.timestamp,
            metadata:  _metadata,
            isRevoked: false,
            chainId:   currentChainId
        });

        ownerDocuments[msg.sender].push(_docHash);
        totalDocuments++;

        emit DocumentNotarized(_docHash, msg.sender, block.timestamp, _metadata, currentChainId);
    }

    /**
     * @dev Verify a document — returns full details.
     */
    function verifyDocument(bytes32 _docHash)
        external
        view
        documentExists(_docHash)
        returns (
            address  owner,
            uint256  timestamp,
            string   memory metadata,
            bool     isRevoked,
            uint256  chainId
        )
    {
        Document memory doc = documents[_docHash];
        return (doc.owner, doc.timestamp, doc.metadata, doc.isRevoked, doc.chainId);
    }

    /**
     * @dev Check if a document hash is registered (quick boolean check).
     */
    function isNotarized(bytes32 _docHash) external view returns (bool) {
        return documents[_docHash].timestamp != 0;
    }

    /**
     * @dev Revoke a document (owner only). Cannot be un-revoked.
     */
    function revokeDocument(bytes32 _docHash)
        external
        onlyOwner(_docHash)
        documentExists(_docHash)
        notRevoked(_docHash)
    {
        documents[_docHash].isRevoked = true;
        emit DocumentRevoked(_docHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Transfer document ownership to a new address.
     */
    function transferOwnership(bytes32 _docHash, address _newOwner)
        external
        onlyOwner(_docHash)
        documentExists(_docHash)
        notRevoked(_docHash)
    {
        require(_newOwner != address(0), "Invalid new owner");
        require(_newOwner != msg.sender,  "Already the owner");

        address previousOwner = documents[_docHash].owner;
        documents[_docHash].owner = _newOwner;

        // Track for new owner
        ownerDocuments[_newOwner].push(_docHash);

        emit OwnershipTransferred(_docHash, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @dev Get all document hashes notarized by a specific address.
     */
    function getOwnerDocuments(address _owner) external view returns (bytes32[] memory) {
        return ownerDocuments[_owner];
    }

    /**
     * @dev Get document count for an owner.
     */
    function getOwnerDocumentCount(address _owner) external view returns (uint256) {
        return ownerDocuments[_owner].length;
    }
}
