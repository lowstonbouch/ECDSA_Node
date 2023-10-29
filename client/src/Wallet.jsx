import server from "./server";
import { useEffect } from "react";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  signature,
  setSignature,
  recoveryPhrases,
  setRecoveryPhrases,
}) {
  useEffect(() => {
    if ((signature, recoveryPhrases)) {
      checkBalance();
    }
  }, [signature, recoveryPhrases]);

  async function onChange(evt) {
    setRecoveryPhrases(evt.target.value);
  }

  async function onChangeSignature(evt) {
    await setSignature(() => evt.target.value);
    console.log(evt.target.value);
  }

  const checkBalance = async () => {
    const sig = secp256k1.Signature.fromCompact(signature);
    let msgHash = toHex(utf8ToBytes(recoveryPhrases));
    for (let i = 0; i <= 1; i++) {
      let publicKey = sig
        .addRecoveryBit(i)
        .recoverPublicKey(msgHash)
        .toRawBytes();
      const address = toHex(publicKey).slice(publicKey.length - 20);
      try {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        console.log(balance);
        if (balance) {
          setAddress(address);
          setBalance(balance);
          return;
        }
      }catch(error){
        console.log(error);
      }
    }
  };

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Recovery phrases
        <input
          placeholder="Type Recovery phrases"
          value={recoveryPhrases}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Signature
        <input
          placeholder="Type a signature"
          value={signature}
          onChange={onChangeSignature}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <button className="button" onClick={checkBalance}>
        Update
      </button>
    </div>
  );
}

export default Wallet;
