import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryPhrases, setRecoveryPhrases] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        signature={signature}
        setSignature={setSignature}
        recoveryPhrases={recoveryPhrases}
        setRecoveryPhrases={setRecoveryPhrases}
      />
      <Transfer setBalance={setBalance} address={address} signature={signature} recoveryPhrases={recoveryPhrases} />
    </div>
  );
}

export default App;
