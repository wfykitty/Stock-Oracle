import React, { useState, useEffect } from "react";
// import './App.css';
import Web3 from 'web3';
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from './quotecontract';
import { TextField, Button } from '@material-ui/core';


function App() {
  //connect Metamask
  const web3 = new Web3("http://localhost:8545");
  //get account #
  const accounts = web3.eth.getAccounts();
  //set stockQuote() link contract 
  var stockQuote = new web3.eth.Contract(
    STOCK_ORACLE_ABI,
    STOCK_ORACLE_ADDRESS
  );
  //app components
  const [input, setInput] = useState("");
  const [symbol, setSymbol] = useState(""); 
  const [data, setData] = useState("");
  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState("");
  const [OracleVolume, setOracleVolume] = useState("");
  const [OraclePrice, setOraclePrice] = useState("");
  

  //write to smart contract
  const updateData = async () => {
    const accounts = await new web3.eth.getAccounts();
    const fetchData = await stockQuote.methods
      .setStock(web3.utils.fromAscii(symbol), parseInt(price), parseInt(volume))
      .send({ from: accounts[0] });
      console.log(fetchData)
    };


  //read the result from smart contract
  const checkOracle = async () => {
    const accounts = await new web3.eth.getAccounts();
    const checkPrice = await stockQuote.methods
      .getStockPrice(web3.utils.fromAscii(symbol))
      .call()
      .then(res => {
        console.log(res);
        setOraclePrice(res);
      });
      // console.log(checkPrice)
    const checkVolume = await stockQuote.methods
      .getStockVolume(web3.utils.fromAscii(symbol))
      .call()
      .then(res => {
        console.log(res) 
        setOracleVolume(res);
      });
      //setOracleVolume(res));
      // console.log(checkVolume)
  };

  useEffect(() => {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=ZOH7IOZE5O4I8CML`) 
      .then(res => res.json())
      .then((res) => {
        const data = res["Global Quote"];    
        if(data !== undefined){
        setPrice(parseInt(data["05. price"] ));
        setVolume(parseInt(data["06. volume"]));
        setData(data); 
      }});
  }, [symbol]);


function onclick(event) {
  event.preventDefault();
  setSymbol(input);
  }

function onChangeSymbol(event){
  event.preventDefault();
  setInput(event.target.value);
}

    return (
      <div>
        <h1>Stock Oracle</h1>
        
            <TextField onChange={onChangeSymbol} />
            <div>*type stock symbol (e.g. AAPL, MSFT) above to check the price and volume</div>
            <Button variant="contained" color="secondary" onClick={onclick} > type stock symbol and click me</Button>
            <div> value={data["01. symbol"]}  </div>
            <div> price={data["05. price"]}</div>
            <div> volume={data["06. volume"]}</div>

            <Button variant="contained" color="primary" onClick={updateData} > hit me to write to smart contract </Button>
            <Button variant="contained" color="primary" onClick={checkOracle} > get data from smart contract </Button>

            {OraclePrice && <p>Price: {OraclePrice}</p>}
            {OracleVolume && <p>Volume: {OracleVolume}</p>}
        </div>

    );
  
}

export default App;


