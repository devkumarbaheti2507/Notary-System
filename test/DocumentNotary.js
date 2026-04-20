const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("DocumentNotary", function () {
  let notary;
  let owner, user1, user2;

  // A helper to create a fake doc hash (bytes32)
  const fakeHash = (str) => ethers.keccak256(ethers.toUtf8Bytes(str));

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const NotaryFactory = await ethers.getContractFactory("DocumentNotary");
    notary = await NotaryFactory.deploy();
    await notary.waitForDeployment();
  });

  // ─── Deployment ────────────────────────────────────────────────────────────

  describe("Deployment", function () {
    it("Should deploy with zero documents", async function () {
      expect(await notary.totalDocuments()).to.equal(0n);
    });
  });

  // ─── Notarize ──────────────────────────────────────────────────────────────

  describe("notarizeDocument", function () {
    it("Should notarize a new document", async function () {
      const hash = fakeHash("my_contract.pdf");
      await expect(notary.connect(user1).notarizeDocument(hash, "My Contract"))
        .to.emit(notary, "DocumentNotarized")
        .withArgs(hash, user1.address, anyValue, "My Contract", anyValue);

      expect(await notary.totalDocuments()).to.equal(1n);
    });

    it("Should reject an already-notarized document", async function () {
      const hash = fakeHash("duplicate.pdf");
      await notary.connect(user1).notarizeDocument(hash, "First");
      await expect(
        notary.connect(user2).notarizeDocument(hash, "Second")
      ).to.be.revertedWith("Document already notarized");
    });

    it("Should reject zero hash", async function () {
      await expect(
        notary.connect(user1).notarizeDocument(ethers.ZeroHash, "Bad")
      ).to.be.revertedWith("Invalid document hash");
    });

    it("Should track owner documents", async function () {
      const h1 = fakeHash("doc1.pdf");
      const h2 = fakeHash("doc2.pdf");
      await notary.connect(user1).notarizeDocument(h1, "Doc 1");
      await notary.connect(user1).notarizeDocument(h2, "Doc 2");

      const docs = await notary.getOwnerDocuments(user1.address);
      expect(docs.length).to.equal(2);
    });
  });

  // ─── Verify ────────────────────────────────────────────────────────────────

  describe("verifyDocument", function () {
    it("Should return correct details after notarization", async function () {
      const hash = fakeHash("verify_me.pdf");
      await notary.connect(user1).notarizeDocument(hash, "Verify Me");

      const [addr, , metadata, isRevoked] = await notary.verifyDocument(hash);
      expect(addr).to.equal(user1.address);
      expect(metadata).to.equal("Verify Me");
      expect(isRevoked).to.equal(false);
    });

    it("Should revert for a non-existent document", async function () {
      await expect(
        notary.verifyDocument(fakeHash("ghost.pdf"))
      ).to.be.revertedWith("Document not found");
    });

    it("isNotarized should return true/false correctly", async function () {
      const hash = fakeHash("check.pdf");
      expect(await notary.isNotarized(hash)).to.equal(false);
      await notary.connect(user1).notarizeDocument(hash, "Check");
      expect(await notary.isNotarized(hash)).to.equal(true);
    });
  });

  // ─── Revoke ────────────────────────────────────────────────────────────────

  describe("revokeDocument", function () {
    it("Should allow owner to revoke", async function () {
      const hash = fakeHash("revoke_me.pdf");
      await notary.connect(user1).notarizeDocument(hash, "Revokable");

      await expect(notary.connect(user1).revokeDocument(hash))
        .to.emit(notary, "DocumentRevoked")
        .withArgs(hash, user1.address, anyValue);

      const [, , , isRevoked] = await notary.verifyDocument(hash);
      expect(isRevoked).to.equal(true);
    });

    it("Should prevent non-owner from revoking", async function () {
      const hash = fakeHash("owned.pdf");
      await notary.connect(user1).notarizeDocument(hash, "Owned");
      await expect(
        notary.connect(user2).revokeDocument(hash)
      ).to.be.revertedWith("Not the document owner");
    });

    it("Should prevent revoking an already revoked document", async function () {
      const hash = fakeHash("already_revoked.pdf");
      await notary.connect(user1).notarizeDocument(hash, "");
      await notary.connect(user1).revokeDocument(hash);
      await expect(
        notary.connect(user1).revokeDocument(hash)
      ).to.be.revertedWith("Document has been revoked");
    });
  });

  // ─── Transfer Ownership ────────────────────────────────────────────────────

  describe("transferOwnership", function () {
    it("Should transfer ownership to a new address", async function () {
      const hash = fakeHash("transfer.pdf");
      await notary.connect(user1).notarizeDocument(hash, "Transfer Me");

      await expect(notary.connect(user1).transferOwnership(hash, user2.address))
        .to.emit(notary, "OwnershipTransferred")
        .withArgs(hash, user1.address, user2.address, anyValue);

      const [newOwner] = await notary.verifyDocument(hash);
      expect(newOwner).to.equal(user2.address);
    });

    it("Should reject transfer to zero address", async function () {
      const hash = fakeHash("bad_transfer.pdf");
      await notary.connect(user1).notarizeDocument(hash, "");
      await expect(
        notary.connect(user1).transferOwnership(hash, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid new owner");
    });

    it("Should reject self-transfer", async function () {
      const hash = fakeHash("self_transfer.pdf");
      await notary.connect(user1).notarizeDocument(hash, "");
      await expect(
        notary.connect(user1).transferOwnership(hash, user1.address)
      ).to.be.revertedWith("Already the owner");
    });

    it("New owner should appear in their document list", async function () {
      const hash = fakeHash("new_owner.pdf");
      await notary.connect(user1).notarizeDocument(hash, "");
      await notary.connect(user1).transferOwnership(hash, user2.address);

      const docs = await notary.getOwnerDocuments(user2.address);
      expect(docs).to.include(hash);
    });
  });
});
