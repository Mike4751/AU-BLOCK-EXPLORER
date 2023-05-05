import { Alchemy, Network, fromHex } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockList, setBlockList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [transactionAmountList, setTransactionAmountList] = useState();

  const navigator = useNavigate();

  useEffect(() => {
    async function getBlockNumber() {
      const currentBlock = await alchemy.core.getBlockNumber();
      let blocks = [];
      let txAmount = [];
      let block = currentBlock;
      for (let i = 1; i < 11; i++) {
        let tx = await alchemy.core.getBlockWithTransactions(currentBlock - i);
        txAmount.push(tx.transactions.length);
        blocks.push(currentBlock - i);
      }
      setTransactionAmountList(txAmount);
      setBlockList(blocks);
      setBlockNumber(await alchemy.core.getBlockNumber());
      const currentTxs = await alchemy.core.getBlockWithTransactions(
        currentBlock
      );
      let txs = [];
      for (let i = 0; i < 10; i++) {
        txs.push(currentTxs.transactions[i]);
      }
      setTransactionList(txs);
    }
    getBlockNumber();
  }, [blockNumber]);

  function handleClick() {
    let inputVal = document.getElementById("inputId").value;
    navigator("/Block", { state: { block: inputVal } });
  }

  const blockRec = blockList.map((item, i) => {
    return (
      <div
        key={i}
        className="mx-w-[277.2px] grid grow-0 grid-cols-2 rounded-xl border-2 border-black p-2"
      >
        <Link to={"/Block"} state={{ block: item }}>
          <div className="col-start-1 hover:font-bold hover:italic">{item}</div>
        </Link>

        <div className="col-start-2">
          {transactionAmountList[i]} Transactions
        </div>
      </div>
    );
  });

  const txRec = transactionList.map((item, i) => {
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
        Cool Block Explorer
      </h1>
      <main className="m-10">
        <div class="mb-3">
          <div class="relative mb-4 flex w-full flex-wrap items-stretch">
            <input
              type="search"
              id="inputId"
              class="focus:border-primary dark:focus:border-primary relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
              placeholder="Enter a Block Number"
              aria-label="Search"
              aria-describedby="button-addon1"
              onSubmit={(event) => handleClick(event)}
            />
            <button
              class="bg-primary hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-800 relative z-[2] flex items-center rounded-r px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
              type="button"
              id="button-addon1"
              data-te-ripple-init
              data-te-ripple-color="light"
              onClick={() => handleClick()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 space-x-4">
          <div className="col-start-1">
            <div className="text-lg font-bold">Latest Blocks</div>
            <div className="mt-3 mb-3 grid grid-cols-1 gap-4">{blockRec}</div>
          </div>
          <div className="col-start-2">
            <div className="text-lg font-bold">Latest Transactions</div>
            <div className="mt-3 mb-3 grid grid-cols-1 gap-4">{txRec}</div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
