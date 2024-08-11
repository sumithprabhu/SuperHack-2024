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
import toast from "react-hot-toast";
import contract_ABI from "../../../Smart-contract/contractABI";
const signin = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { data: isUserRegistered } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: contract_ABI,
    chainId: 11155111,
    functionName: "isUserRegistered",
    args: [address],
  });
  const checkLogin = () => {
    if (isConnected) {
      // Redirect to the home page after a successful connection

      if (isUserRegistered) {
        toast.success("Login Successful, Redirecting to Home Page");
        setTimeout(function () {
          router.push("/");
        }, 3000);
      } else {
        console.log(isUserRegistered);
        toast.error("User not registered\nPlease Sign Up");
      }
    }
  };
  return (
    <div className="md:flex flex-col items-center justify-center w-full flex-1 h-[100vh] md:px-20 md:h-screen bg-gray-100 text-center">
      <div className="bg-white rounded-2xl  shadow-2xl md:flex md:w-2/3 max-w-4xl">
        <div className="md:w-3/5 p-5">
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
            </div>
			<button
              className="bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={checkLogin}
            >
              Login
            </button>
          </div>
        </div>
        <div className="md:w-2/5 bg-green-600 md:rounded-t-2xl rounded-b-2xl pt-8 pb-60 md:py-36 px-12">
          {/*Signup section*/}
          <div className=" w-full h-full ">
            <h2 className="md:text-3xl text-4xl font-bold pt-8 mb-2 ">
              Hey, There!
            </h2>
            <div className="border-2 w-10 border-white inline-block mt-4 mb-4 md:mb-10"></div>
            {/*white bar*/}
            <p className=" text-2xl md:text-xl md:mb-4">
              Don't have an account?
              <br /> No worries, SignUp here.
            </p>
            <a
              href="/signup"
              className="border-2 border-white rounded-full mt-8 px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-600"
            >
              Sign Up
            </a>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default signin;
