import { Alchemy, Network, fromHex } from "alchemy-sdk";
import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);
// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface

function Transaction() {
  const location = useLocation();
  const hash = location.state.hash;
  const [transactionDets, setTransactionDets] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBlockNumber() {
      const txDets = await alchemy.core.getTransactionReceipt(hash);
      console.log(txDets);
      setTransactionDets(txDets);
    }
    getBlockNumber();
  }, []);

  return (
    <>
      <h1 className="m-10 items-center border-black align-middle text-2xl font-bold outline-2">
        Transaction Hash: {hash}
      </h1>
      <main className="grid grid-cols-2">
        {transactionDets && (
          <div className="ml-10">
            <div className="mb-3 items-center border-black align-middle text-xl font-bold outline-2">
              Transaction Information
            </div>
            <div className="col">
              Status: {transactionDets.status == 0 ? "Failed" : "Success"}
            </div>

            <div className="space-y-3">
              <div className="col">
                <div className="blockDetails">
                  Block: {transactionDets.blockNumber}
                </div>
                <div className="blockDetails">From: {transactionDets.from}</div>
                <div className="blockDetails">To: {transactionDets.to}</div>
                <div className="blockDetails">
                  Transaction Index: {transactionDets.transactionIndex}
                </div>
                <div className="blockDetails">
                  Confirmations: {transactionDets.confirmations}
                </div>
                <div className="blockDetails">Type: {transactionDets.type}</div>
                <div className="blockDetails">
                  Byzantium: {transactionDets.byzantium ? "True" : "False"}
                </div>
                <div className="blockDetails">
                  Cumulative Gas Used:{" "}
                  {fromHex(transactionDets.cumulativeGasUsed)}
                </div>
                <div className="blockDetails">
                  Gas Used: {fromHex(transactionDets.gasUsed)}
                </div>
                <div className="blockDetails">
                  Effective Gas Price:{" "}
                  {(
                    fromHex(transactionDets.effectiveGasPrice) /
                    10 ** 9
                  ).toFixed(2)}{" "}
                  Gwei
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Transaction;
