import React from "react";
import "./app.css"
import { useState, useEffect } from "react"
import { ethers } from "ethers";

function App() {

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        getBalance(accounts[0]);
        fetchCryptoPrices();
      } catch (err) {
        setError("Erro ao conectar à MetaMask");
      }
    } else {
      setError("MetaMask não está instalada");
    }
  };

  const getBalance = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      setBalance(parseFloat(ethers.formatEther(balance)).toFixed(4));
    } catch (err) {
      setError("Erro ao obter saldo: " + err.message);
    }
  };

  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1");
      const data = await response.json();
      setData(data)
      console.log(data)
    } catch (err) {
      setError("Erro ao obter preços das criptomoedas: " + err.message);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
        if (accounts.length > 0) getBalance(accounts[0]);
      });
    }
    fetchCryptoPrices();
  }, []);

  return (
    <div className="App">
       <h2>Conectar Wallet</h2>
      {account ? (
        <div>
          <p>Conta: {account}</p>
          <p>Saldo: {balance} ETH</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Conectar</button>
      )}
      {data ? (
          data.map((item,index) => {
            return (
            <div key={index} className="box-item">
              <p className="rank">#{item.market_cap_rank}</p>
              <img src={item.image} alt={item.id} width="50px" className="crypto-image" />
              <p className="crypto-name">{String(item.id).toUpperCase()}</p>
              <p className="price">PRICE: ${item.current_price*6}</p>
              <p className="market-cap">MARKETCAP R$ {item.market_cap.toLocaleString()}</p>
            </div>
            )
          })
        
      ) : (
        <p>loading...</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
