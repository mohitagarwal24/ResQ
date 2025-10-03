import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    const signers = await ethers.getSigners();
    const pk = process.env.VITE_DEPLOYER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
    const deployer = signers[0] || (pk ? new ethers.Wallet(pk, ethers.provider) : undefined);
    if (!deployer) {
        throw new Error("No deployer available. Set DEPLOYER_PRIVATE_KEY in .env or configure accounts in hardhat.config.cjs");
    }
    console.log("Deploying with:", await deployer.getAddress());

    const DonationBoard = await ethers.getContractFactory("DonationBoard", deployer);
    const contract = await DonationBoard.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("DonationBoard deployed at:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


