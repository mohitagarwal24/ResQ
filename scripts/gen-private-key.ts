import 'dotenv/config';
import { Mnemonic, HDKey } from "@vechain/sdk-core";

async function main() {
    const phrase = process.env.VITE_MNEMONIC;
    if (!phrase) {
        throw new Error("VITE_MNEMONIC not set in .env. Add your mnemonic to derive its private key.");
    }
    const words: string[] = phrase.trim().split(/\s+/);
    const count = Number(process.env.VITE_DERIVATION_COUNT || '2');
    console.log("Mnemonic:", words.join(" "));
    for (let i = 0; i < count; i++) {
        const path = `${HDKey.VET_DERIVATION_PATH}/${i}`;
        const pkBytes = Mnemonic.toPrivateKey(words, path);
        const privateKey = "0x" + Buffer.from(pkBytes).toString("hex");
        console.log(`\nIndex ${i} Path ${path}`);
        console.log("Private Key:", privateKey);
    }
    console.log("\nTip: set VITE_DERIVATION_COUNT in .env to change how many keys are derived.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


