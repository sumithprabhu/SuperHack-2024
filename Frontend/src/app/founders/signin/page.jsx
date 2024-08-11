"use client";
import MetamaskLogo from "@/components/metamask_logo/metamask_logo";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useRouter } from "next/navigation";
import contract_ABI from "../../../../Smart-contract/contractABI";
import toast from "react-hot-toast";

const signin = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const { data: isFounderRegistered } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: contract_ABI,
    chainId: 11155111,
    functionName: "isFounderRegistered",
    args: [address],
  });

  const handleLogin = () => {
    if (isConnected) {
        if (isFounderRegistered) {
            toast.success("Login Successful, Redirecting to your profile Page");
            setTimeout(() => {
                router.push("/founders/portfolio/profile");
            }, 3000);
        } else {
            console.log(isFounderRegistered);
            toast.error("Founder not registered");
            toast.error("Please Sign Up");
        }
    }
};

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 h-[100vh] md:px-20 md:h-screen bg-gray-100 text-center">
      <div className="bg-white rounded-2xl  shadow-2xl md:flex">
        <div className=" p-5">
          {/*Login Section*/}
          <div className="text-left font-bold">
            <Link href="/" className="text-green-600">
              RaiseCoin
            </Link>
          </div>

          <div className="py-10">
            <h2 className="text-3xl font-bold text-green-600 mb-2">Sign In</h2>
            {/* green bar */}
            <div className="border-2 w-10 border-green-600 inline-block mb-4"></div>

            <div>
              {/* Metamask logo */}
              <MetamaskLogo />
            </div>
            <div className="flex flex-col items-center">
              <ConnectButton
                chainStatus="none"
                label="Connect Wallet"
                showBalance={false}
              />
              <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 text-lg font-bold mt-4"
        >
            Login
        </button>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default signin;
