require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

/** @type {import('hardhat/config').HardhatUserConfig} */
const config = {
    solidity: {
        version: '0.8.24',
        settings: {
            optimizer: { enabled: true, runs: 200 }
        }
    },
    paths: {
        sources: 'contracts',
        tests: 'test',
        cache: 'cache',
        artifacts: 'artifacts'
    },
    networks: {
        vechainTest: {
            url: process.env.VITE_THOR_NODE_URL || 'https://testnet.vechain.org',
            accounts: (process.env.VITE_DEPLOYER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY)
                ? [process.env.VITE_DEPLOYER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY]
                : []
        }
    }
};

module.exports = config;


