import React from 'react';
import logo from './logo.svg';
import './App.css';
//import { ethers } from 'ethers';
import { ethers } from 'hardhat';
import { BigNumberish, Signer } from "ethers";
import { SimpleEventEmitter } from "../typechain-types";  // where to get this file???
//import { Network } from "ethers/providers";
import { SimpleAccountAPI, HttpRpcClient } from "@account-abstraction/sdk";
import { JsonRpcProvider, Network } from "@ethersproject/providers";



function App() {

  function handleClick() {
    console.log("I was clicked")
    // take functions below testDesc2 
    // return magicStuff(textBoxInput)
  }
  // model off of https://www.youtube.com/watch?v=QS6Y0ezhyCs (Simple Calculator Using JavaScript, HTML, CSS)
  // this code was pulled from : https://github.com/richwarner/aa-bundler-test/blob/main/test/AATester.ts
  /// seriously, you need someone who spends a lot of time doing front end to complete the handleClick
  /// https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form
  /// or try it with react: https://github.com/AlbertLin0703/Calculate

  // @types/async-eventemitter@^0.2.1 could be used for SimpleEventEmitter ? (see defining types in typescript)
  // SimpleEventEmitter.sol
  /*
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.15;
  
  contract SimpleEventEmitter {
      // Define the event
      event ParameterEmitted(bytes parameter);
  
      // Function to emit the event
      function emitEvent(bytes memory parameter) public {
          emit ParameterEmitted(parameter);
      }
  }
  */
  /// will https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/async-eventemitter/index.d.ts work with the contract???

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
  // this test needs to be replaced by a function that can be called by handleClick
  //it("should make a simple contract call using account abstraction", async function () {
  /// textboxInput should be isauthenticated ? 1 : 0
  const magicStuff = async function (textboxInput) {
    console.log('\n     > TEST: Running "' + testDesc2 + '"...');
    // the button triggered by handleClick needs to send an argument:
    // buttonArgument = textBoxInput
    // const parameter = ethers.utils.toUtf8Bytes(buttonArgument);
    const parameter = ethers.utils.toUtf8Bytes("Test 2");
    const userOp = await simpleAccountApi.createSignedUserOp({
      target: contract.address,
      value: 0,
      data: contract.interface.encodeFunctionData("emitEvent", [parameter]),
      ...(await getGasFee(ethers.provider)),  // I am not sure why the property 'provider' does not exist on ethers
    });
    const userOpHash = await bundlerClient.sendUserOpToBundler(userOp);
    console.log(`       UserOperation hash: ${userOpHash}`);
    console.log("       Waiting for transaction...");
    const txHash = await simpleAccountApi.getUserOpReceipt(userOpHash);
    console.log(`       Transaction hash: ${txHash}`);
    await expect(txHash).to.emit(contract, "ParameterEmitted").withArgs(parameter);
  };
  // });

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
