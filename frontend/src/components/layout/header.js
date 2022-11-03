import NextFunctionComponent from "next";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "../../components/atoms/button";

export const Header = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadAddress();
    // setAddress(await isConnectedWallet());
  }, []);

  const loadAddress = async () => {
    if (!isDetectedWallet()) return false;
    const account = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (account.length == 0) return setAddress(undefined);
    setAddress(account[0]);
  };

  const connectWallet = async () => {
    //console.log('1. ethereum:', ethereum)
    if (!isDetectedWallet()) {
      alert("ウォレットが見つかりませんでした");
      return;
    }
    if (!(await isValidChain())) return;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length == 0) return;
    setAddress(accounts[0]);
  };

  return (
    <header className="flex flex-col items-center my-3">
      <Image
        src="/logo.png"
        alt="Ryuzetsu"
        width={239}
        height={69}
        className="m-2"
      />
      <Button onClick={connectWallet} disabled={!!address}>
        <span>{address ? "Connected" : "Connect Wallet"}</span>
      </Button>
    </header>
  );
};

const CHAIN = { name: "Mumbai", id: "0x13881" };

const isValidChain = async () => {
  //console.log('call isValidChain')
  ethereum = window.ethereum;
  let chainId = await ethereum.request({ method: "eth_chainId" });
  if (chainId == CHAIN.id) {
    //console.log('Connected to chain:' + chainId)
    return true;
  } else {
    //alert('You are not connected to the Mumbai Testnet!')
    alert(`${CHAIN.name}チェーンに接続してください`);
    return false;
  }
};
// Walletを検出しているかどうか
const isDetectedWallet = () => {
  ethereum = window.ethereum;
  if (ethereum) {
    return true;
  } else {
    return false;
  }
};
