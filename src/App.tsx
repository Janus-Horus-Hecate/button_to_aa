import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import { BigNumberish, Signer } from "ethers";
import { SimpleEventEmitter } from "../typechain-types";  // where to get this file???
//import { Network } from "ethers/providers";
import { SimpleAccountAPI, HttpRpcClient } from "@account-abstraction/sdk";
import { JsonRpcProvider, Network } from "@ethersproject/providers";



function App() {

  function handleClick() {
    console.log("I was clicked")
  }

  // this code was pulled from : https://github.com/richwarner/aa-bundler-test/blob/main/test/AATester.ts

  let signers: any[];
  let signer: Signer;
  let contract: SimpleEventEmitter;
  let simpleAccountApi: SimpleAccountAPI;
  let network: Network;
  let bundlerEndpoint: string;
  let bundlerClient: any;
  let contractAddress: string;

  // this code was pulled from : https://github.com/richwarner/aa-bundler-test/blob/main/test/AATester.ts
  // Run a simple test with account abstraction
  const testDesc2 = "should make a simple contract call using account abstraction";
  it("should make a simple contract call using account abstraction", async function () {
    console.log('\n     > TEST: Running "' + testDesc2 + '"...');
    // the button triggered by handleClick needs to send an argument:
    // const parameter = ethers.utils.toUtf8Bytes(buttonArgument);
    const parameter = ethers.utils.toUtf8Bytes("Test 2");
    const userOp = await simpleAccountApi.createSignedUserOp({
      target: contract.address,
      value: 0,
      data: contract.interface.encodeFunctionData("emitEvent", [parameter]),
      ...(await getGasFee(ethers.provider)),
    });
    const userOpHash = await bundlerClient.sendUserOpToBundler(userOp);
    console.log(`       UserOperation hash: ${userOpHash}`);
    console.log("       Waiting for transaction...");
    const txHash = await simpleAccountApi.getUserOpReceipt(userOpHash);
    console.log(`       Transaction hash: ${txHash}`);
    await expect(txHash).to.emit(contract, "ParameterEmitted").withArgs(parameter);
  });

  // this code was pulled from : https://github.com/richwarner/aa-bundler-test/blob/main/test/AATester.ts
  // Utility function for gas
  interface Gas {
    maxFeePerGas: BigNumberish;
    maxPriorityFeePerGas: BigNumberish;
  }
  async function getGasFee(provider: JsonRpcProvider): Promise<Gas> {
    const [fee, block] = await Promise.all([provider.send("eth_maxPriorityFeePerGas", []), provider.getBlock("latest")]);
    const tip = ethers.BigNumber.from(fee);
    const buffer = tip.div(100).mul(13);
    const maxPriorityFeePerGas = tip.add(buffer);
    const maxFeePerGas = block.baseFeePerGas
      ? block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas)
      : maxPriorityFeePerGas;

    return { maxFeePerGas, maxPriorityFeePerGas };
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <form>
          <input name="" placeholder="dummy"></input>  {/* this text field needs to send an argument to handleClick */}
          <button onClick={handleClick}>Click Me</button>
        </form>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
