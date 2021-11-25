/* eslint-disable no-unused-expressions */
import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { ethers } from "hardhat";

chai.use(chaiAsPromised);
const { expect } = chai;

const setup = async () => {
  const GENESIS = await ethers.getContractFactory("TestContract");
  const genesisContract = await GENESIS.deploy("GENESIS", "GNS");

  const PIXEL = await ethers.getContractFactory("TestContract");
  const pixelContract = await PIXEL.deploy("PIXEL", "PXL");

  const FXC = await ethers.getContractFactory("FXC");
  const fxc = await FXC.deploy();

  const FXCSale = await ethers.getContractFactory("FXCSale");
  const fxcsale = await FXCSale.deploy(
    [genesisContract.address, pixelContract.address],
    fxc.address
  );
  await Promise.all([
    fxc.deployed(),
    fxcsale.deployed(),
    genesisContract.deployed(),
    pixelContract.deployed(),
  ]);

  fxc.setDelegate(fxcsale.address, true);
  await fxcsale.setActive(true);

  return { genesisContract, pixelContract, fxc, fxcsale };
};

describe("FXC", function () {
  it("Should deploy successfully", async function () {
    const FXC = await ethers.getContractFactory("FXC");
    const fxc = await FXC.deploy();

    const FXCSale = await ethers.getContractFactory("FXCSale");
    const fxcsale = await FXCSale.deploy(
      [
        "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
        "0xca5c9ebc14acead8794e99ca417db75d006f4d3b",
      ],
      fxc.address
    );
    await Promise.all([fxc.deployed(), fxcsale.deployed()]);

    // eslint-disable-next-line no-unused-expressions
    expect(await fxcsale.isActive()).to.be.false;
  });

  describe("when minting a SILVER FXC", () => {
    it("should mint successfully when holding a genesis foxxie", async () => {
      // SETUP
      const { genesisContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 1]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = await signer.sendTransaction(transaction);

      await mintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(1);
    });

    it("should mint successfully when holding a pixel foxxie", async () => {
      // SETUP
      const { pixelContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 1]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = await signer.sendTransaction(transaction);

      await mintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(1);
    });

    it("should mint successfully when holding multiple pixel foxxie and a FXC token", async () => {
      // SETUP
      const { pixelContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);
      pixelContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 1]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = await signer.sendTransaction(transaction);

      await mintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(1);

      // TEST
      const newData = fxcsale.interface.encodeFunctionData("mint", [1, 1]);

      const newTransaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data: newData,
      };

      const newMintTx = await signer.sendTransaction(newTransaction);

      await newMintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(2);
    });

    it("should mint successfully when holding both a pixel and a genesis foxxie", async () => {
      // SETUP
      const { pixelContract, genesisContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 1]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = await signer.sendTransaction(transaction);

      await mintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(1);
    });

    it("should mint multiple FXC successfully when holding both a pixel and a genesis foxxie", async () => {
      // SETUP
      const { pixelContract, genesisContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);
      genesisContract.mint(signer.address);
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [3, 1]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.18"),
        data,
      };

      const mintTx = await signer.sendTransaction(transaction);

      await mintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(3);
    });

    it("should not mint when holding neither a pixel nor a genesis foxxie", async () => {
      // SETUP
      const { fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 1]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = signer.sendTransaction(transaction);

      expect(mintTx).to.be.rejected;

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(0);
    });

    it("should not mint when not holding enough pixel or genesis foxxie tokens", async () => {
      // SETUP
      const { fxcsale, fxc, pixelContract, genesisContract } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [3, 1]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.18"),
        data,
      };

      const mintTx = signer.sendTransaction(transaction);

      expect(mintTx).to.be.rejected;

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(0);
    });
  });

  describe("when minting a GOLD FXC", () => {
    it("should not mint successfully when holding a genesis foxxie", async () => {
      // SETUP
      const { genesisContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 0]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = signer.sendTransaction(transaction);

      expect(mintTx).to.be.rejected;

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(0);
    });

    it("should not mint successfully when holding a pixel foxxie", async () => {
      // SETUP
      const { pixelContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 0]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = signer.sendTransaction(transaction);

      expect(mintTx).to.be.rejected;

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(0);
    });

    it("should mint successfully when holding both a pixel and a genesis foxxie", async () => {
      // SETUP
      const { pixelContract, genesisContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 0]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = await signer.sendTransaction(transaction);

      await mintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(1);
    });

    it("should mint multiple FXC successfully when holding both a pixel and a genesis foxxie", async () => {
      // SETUP
      const { pixelContract, genesisContract, fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);
      pixelContract.mint(signer.address);
      genesisContract.mint(signer.address);
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [2, 0]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.12"),
        data,
      };

      const mintTx = await signer.sendTransaction(transaction);

      await mintTx.wait();

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(2);
    });

    it("should not mint when holding neither a pixel nor a genesis foxxie", async () => {
      // SETUP
      const { fxcsale, fxc } = await setup();
      const [signer] = await ethers.getSigners();

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [1, 0]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.06"),
        data,
      };

      const mintTx = signer.sendTransaction(transaction);

      expect(mintTx).to.be.rejected;

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(0);
    });

    it("should not mint when not holding enough pixel or genesis foxxie tokens", async () => {
      // SETUP
      const { fxcsale, fxc, pixelContract, genesisContract } = await setup();
      const [signer] = await ethers.getSigners();
      pixelContract.mint(signer.address);
      genesisContract.mint(signer.address);

      // TEST
      const data = fxcsale.interface.encodeFunctionData("mint", [3, 0]);

      const transaction = {
        to: fxcsale.address,
        from: signer.address,
        value: ethers.utils.parseEther("0.18"),
        data,
      };

      const mintTx = signer.sendTransaction(transaction);

      expect(mintTx).to.be.rejected;

      // RESULT
      expect(await fxc.balanceOf(signer.address)).to.eq(0);
    });
  });
});
