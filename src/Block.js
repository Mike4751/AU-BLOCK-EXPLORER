import { Alchemy, Network, fromHex } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Transaction from "./Transaction";
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

function Block() {
  const [blockDetails, setBlockDetails] = useState();
  const [transactionList, setTransactionList] = useState([]);

  const location = useLocation();
  console.log("location", location);
  const blockNumber =
    typeof location.state.block === Number
      ? location.state.block
      : Number(location.state.block);
  console.log("BLOCK", typeof blockNumber);

  useEffect(() => {
    async function getBlockNumber() {
      console.log(blockNumber);
      const blockTrans = await alchemy.core.getBlockWithTransactions(
        blockNumber
      );
      console.log(blockTrans.transactions[0]);
      setTransactionList(blockTrans.transactions);
      const blockDets = await alchemy.core.getBlock(blockNumber);
      console.log(blockDets);
      setBlockDetails(blockDets);
    }
    getBlockNumber();
  }, []);

  const transactions = transactionList.map((item, i) => {
    return (
      <div
        key={i}
        className="grid grow-0 grid-cols-2 rounded-xl border-2 border-black p-2"
      >
        <Link to={"/Transaction"} state={{ hash: item.hash }}>
          <div className="truncate hover:font-bold hover:italic">
            Tx: {item.hash.slice(0, 25)}...
          </div>
        </Link>

        <div className="grid grid-cols-1">
          <div>
            From: {item.from.slice(0, 8)}...
            {item.from.slice(item.from.length - 8, item.from.length)}
          </div>
          <div>
            To: {item.to.slice(0, 8)}...
            {item.to.slice(item.to.length - 8, item.to.length)}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <h1 className="m-10 items-center border-black align-middle text-2xl font-bold outline-2">
        Block Number: {blockNumber}
      </h1>
      <main className="grid grid-cols-2">
        {blockDetails && (
          <div className="ml-10">
            <div className="items-center border-black align-middle text-xl font-bold outline-2">
              Block Information
            </div>
            <div className="col">
              Transactions: {blockDetails.transactions.length}
            </div>

            <div className="space-y-3">
              <div className="col">
                <div className="blockDetails">Nonce: {blockDetails.nonce}</div>
                <div className="blockDetails">Hash: {blockDetails.hash}</div>
                <div className="blockDetails">
                  Parent Hash: {blockDetails.parentHash}
                </div>
                <div className="blockDetails">Miner: {blockDetails.miner}</div>
                <div className="blockDetails">
                  Difficulty: {blockDetails.difficulty}
                </div>
                <div className="blockDetails">
                  Extra Data: {blockDetails.extraData}
                </div>
                <div className="blockDetails">
                  Gas Limit: {fromHex(blockDetails.gasLimit)}
                </div>
                <div className="blockDetails">
                  Gas Used: {fromHex(blockDetails.gasUsed)}
                </div>
                <div className="blockDetails">
                  Timestamp: {blockDetails.timestamp}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="m-4 space-y-3">{transactions}</div>
      </main>
    </>
  );
}

export default Block;
