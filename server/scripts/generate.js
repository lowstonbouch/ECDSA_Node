import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 }  from "ethereum-cryptography/keccak";
import { generateMnemonic }  from "ethereum-cryptography/bip39/index.js";
import { wordlist }  from "ethereum-cryptography/bip39/wordlists/english.js";
import fs  from 'fs';

export const generateWallets = async () => {
    fs.writeFileSync('./files/Wallets.txt', '', (err) => {
        if (err) throw err;
    });
    const addresses = [];
    for (let i = 0; i < 3; i++) {
        let privateKey = secp256k1.utils.randomPrivateKey();
        let publicKey = secp256k1.getPublicKey(privateKey);
        console.log('publicKey: ', toHex(publicKey))
        const recoveryPhrases = generateMnemonic(wordlist);
        let msgHash = toHex(utf8ToBytes(recoveryPhrases));
        console.log('msgHash: ', msgHash);
        let address = toHex(publicKey).slice(publicKey.length - 20);
        console.log('address: ', address);
        addresses.push(address);
        const signature = await secp256k1.sign(msgHash, privateKey); // Sync methods below
        console.log('toCompHex signature: ', signature.toCompactHex());
        console.log('toDexHex signature: ', signature.toDERHex());
        console.log('sig: ', signature);
    
        fs.appendFileSync('./files/Wallets.txt', `Wallet ${i}: ` + '\n', (err) => {
            if (err) throw err;
        });
        fs.appendFileSync('./files/Wallets.txt', '\t Private: ' + toHex(privateKey) + ';' + '\n', (err) => {
            if (err) throw err;
        });
        fs.appendFileSync('./files/Wallets.txt', '\t Public: ' + address + ';' + '\n', (err) => {
            if (err) throw err;
        });
        fs.appendFileSync('./files/Wallets.txt', '\t Signature: ' + signature.toCompactHex() + ';' + '\n', (err) => {
            if (err) throw err;
        });
        fs.appendFileSync('./files/Wallets.txt', '\t Recovery phrases: ' + recoveryPhrases + ';' + '\n', (err) => {
            if (err) throw err;
        });
    }
    return addresses;
};
