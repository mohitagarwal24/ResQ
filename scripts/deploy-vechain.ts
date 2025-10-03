import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { Clause, Hex, Transaction, type TransactionBody, type TransactionClause } from '@vechain/sdk-core';

async function main() {
    const rpc = process.env.VITE_THOR_NODE_URL;
    const pk = process.env.VITE_DEPLOYER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
    if (!rpc) throw new Error('VITE_THOR_NODE_URL not set');
    if (!pk) throw new Error('VITE_DEPLOYER_PRIVATE_KEY not set');

    // Load bytecode from Hardhat artifacts
    const artifactPath = path.resolve(
        process.cwd(),
        'artifacts/contracts/DonationBoard.sol/DonationBoard.json'
    );
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const bytecode = artifact.bytecode as string;
    if (!bytecode || bytecode === '0x') throw new Error('Bytecode missing. Run npx hardhat compile');

    // Create deploy clause
    const deployClause = Clause.deployContract(Hex.of(bytecode));

    // Build transaction
    const genesisResp = await fetch(rpc + '/blocks/0');
    if (!genesisResp.ok) throw new Error('Failed to query genesis');
    const genesis = await genesisResp.json();
    const headResp = await fetch(rpc + '/blocks/best');
    if (!headResp.ok) throw new Error('Failed to query best block');
    const head = await headResp.json();

    // blockRef: first 8 bytes of best block id (keep '0x' + 16 hex)
    const blockRef = head.id.slice(0, 18);
    // 8-byte nonce (0x + 16 hex)
    const nonce = ('0x' + Math.random().toString(16).slice(2, 18)).padEnd(18, '0');

    // chainTag: last 1 byte of genesis block id
    const chainTag = Number('0x' + genesis.id.slice(-2));
    const txBody: TransactionBody = {
        chainTag,
        blockRef,
        expiration: 720,
        clauses: [deployClause as unknown as TransactionClause],
        gasPriceCoef: 0,
        gas: 3_000_000,
        dependsOn: null,
        nonce
    };

    const pkHex = pk.startsWith('0x') ? pk.slice(2) : pk;
    const priv = Uint8Array.from(Buffer.from(pkHex, 'hex'));
    if (priv.length !== 32) throw new Error('Private key must be 32 bytes');
    const signed = Transaction.of(txBody).sign(priv);

    const raw = '0x' + Buffer.from(signed.encoded).toString('hex');
    const resp = await fetch(rpc + '/transactions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ raw })
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error('Broadcast failed: ' + text);
    }
    const { id: txid } = await resp.json();
    console.log('Broadcasted tx:', txid);

    // Poll receipt
    let contractAddress: string | undefined;
    for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const rResp = await fetch(rpc + '/transactions/' + txid + '/receipt');
        if (rResp.status === 404) continue;
        if (!rResp.ok) throw new Error('Receipt error');
        const receipt = await rResp.json();
        if (!receipt) continue;  // Skip if receipt is null (transaction not yet included)
        contractAddress = receipt.outputs?.[0]?.contractAddress;
        if (contractAddress) break;
    }
    if (!contractAddress) throw new Error('Deploy success but no contractAddress in receipt');
    console.log('DonationBoard deployed at:', contractAddress);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
