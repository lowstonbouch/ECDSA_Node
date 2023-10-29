import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { generateMnemonic } from "ethereum-cryptography/bip39/index.js";
import { wordlist } from "ethereum-cryptography/bip39/wordlists/english.js";
import fs from "fs";

export const verify = async (signature, sender, msgHash) => {
  const sig = secp256k1.Signature.fromCompact(signature);
  console.log(sig);
  for (let i = 0; i <= 1; i++) {
    let publicKey = sig
      .addRecoveryBit(i)
      .recoverPublicKey(msgHash)
      .toRawBytes();
    const address = toHex(publicKey).slice(publicKey.length - 20);
    if (address === sender) {
        return true;
    }
  }
  return false;
};
