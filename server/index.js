import express from "express";
const app = express();
import cors from "cors";
const port = 3042;
import { generateWallets } from "./scripts/generate.js";
import { verify } from "./scripts/verify.js";

app.use(cors());
app.use(express.json());

const balances = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  if(!balances[address]) {
    res.status(400).send({ message: "Not found!" });
  } else {
    const balance = balances[address];
    res.send({ balance });
  }
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, msgHash } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (verify(signature, sender, msgHash)) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Unauthorised!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
(async () => {
  const addresses = await generateWallets();
  addresses.forEach((element, index) => {
    balances[element] = (index + 1) * 10;
  });
  console.log(balances);
})();
