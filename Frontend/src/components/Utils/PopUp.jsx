"use client";
import React, { useState, useEffect, useRef, use } from "react";
import { ImCancelCircle } from "react-icons/im";
import { FaArrowLeft } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa6";
import { uploadMetadata } from "../../utils/uploadMetadata";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import ImageWithDescription from "../../utils/imageWithDescription";
import { uploadImage } from "../../utils/uploadImage";
import contract_ABI from "../../../Smart-contract/contractABI";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import Lottie from "react-lottie";
import animationData from "../../../lotties/Successfull.json";
import { Grid } from "react-loader-spinner";

const PopUp = ({ handleOpen, details, id }) => {
  const [amt, setAmt] = useState(500);
  const [confirmPage, setConfirmPage] = useState(false);
  const [price, setPrice] = useState(null);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [imageFile, setImageFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showNFTPage, setShowNFTPage] = useState(false);
  const [btnText, setBtnText] = useState("Confrim Transaction");
  const [confirmed, setConfirmed] = useState(false);
  const [nftLink, setNftLink] = useState("");
  const [tnxid, setTnxid] = useState("");
  const [first, setFirst] = useState("");
  const receipt = useWaitForTransactionReceipt({
    hash: tnxid,
    enabled: Boolean(tnxid),
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
  const { data: userID } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: contract_ABI,
    chainId: 11155111,
    functionName: "getUserID",
    args: [address],
  });
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPrice(data.ETH);
      } catch (error) {
        console.error("Failed to fetch price:", error);
      }
    };
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${userID}`;
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        const jsonResponse = await response.json();
        if (jsonResponse.data) {
          setFirst(jsonResponse.data.attributes.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
    fetchPrice();
  }, [userID]);

  useEffect(() => {
    if (receipt.isSuccess) {
      console.log("transaction", parseInt(receipt.data.logs[1].data, 16));
      setNftLink(
        `https://testnets.opensea.io/assets/sepolia/${
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        }/${parseInt(receipt.data.logs[1].data, 16)}`
      );
      setConfirmed(true);
      updateUserInvestmentDetails();
    }
  }, [receipt]);

  const handleImageProcessed = (file) => {
    setImageFile(file);
    // Create a URL from the File object
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    // Here, you might also want to upload the file to the server
    console.log(file); // Debugging to see the file object
  };

  async function updateInvestorDetails() {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups/${id}`;
    try {
      // Fetch the current data of the startup
      let response = await fetch(url);
      let data = await response.json();

      // Check if investorDetail exists and prepare the updated data
      let updatedInvestorDetails =
        details.investorDetail != null ? details.investorDetail : [];
      console.log(updatedInvestorDetails);
      // Append new investor data // Use existing or initialize as empty array
      updatedInvestorDetails.push({
        userID: userID,
        name: first,
        amount: amt,
        shares: `${Math.ceil(amt / details.pricePerShare)}`,
        date: new Date().toISOString(),
        ethPaid: (price * amt).toFixed(4),
        docStatus: "Pending",
        document: "",
        paymentStatus: "In Transit",
      });

      // Prepare the body for the PATCH request
      const updateData = {
        data: {
          investorDetail: updatedInvestorDetails,
        },
      };
      console.log(updateData);
      const replacer = (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
      // Send a PATCH request to update the startup entry
      response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData, replacer),
      });

      if (!response.ok) {
        throw new Error("Failed to update startup details");
      }

      console.log("Investor details updated successfully");
    } catch (error) {
      console.error("Error updating investor details:", error);
    }
  }

  async function updateUserInvestmentDetails() {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${userID}`;
    try {
      // Fetch the current data of the user
      let response = await fetch(url);
      let data = await response.json();

      // Check if investmentDetail exists and prepare the updated data
      let updatedInvestmentDetails =
        data.investmentDetail != null ? data.investmentDetail : [];

      // Append new investment data
      updatedInvestmentDetails.push({
        companyNamed: details.startupName,
        startupID: id,
        document: "",
        shares: `${Math.ceil(amt / details.pricePerShare)}`,
        nftId: `${parseInt(receipt.data.logs[1].data, 16)}`,
        shareValueInEth: (price * amt).toFixed(4),
        dateOfPurchase: new Date().toISOString(),
        status: "Pending",
        paymentStatus: "In Transit",
      });

      // Prepare the body for the PATCH request
      const updateData = {
        data: {
          investmentDetail: updatedInvestmentDetails,
        },
      };
      const replacer = (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
      // Send a PATCH request to update the user entry
      response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData, replacer),
      });
      updateUserInvestorValue(amt);
      updateFounderInvestedValue(amt);

      if (!response.ok) {
        throw new Error("Failed to update user investment details");
      }

      console.log("User investment details updated successfully");
    } catch (error) {
      console.error("Error updating user investment details:", error);
    }
  }

  async function updateUserInvestorValue(newValue) {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${userID}`;
  
    try {
      // Fetch the current user data
      const response = await fetch(url, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const jsonResponse = await response.json();
      
      // Get the current investedValue
      const currentInvestedValue = Number(jsonResponse.data.attributes.InvestedValue || 0);
      
      // Calculate the new total investedValue
      const updatedInvestedValue = currentInvestedValue + Number(newValue);
      
      // Prepare the body for the PUT request
      const updateData = {
        data: {
          InvestedValue: updatedInvestedValue,
        },
      };
      
      // Send a PUT request to update the user's investedValue
      const updateResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      if (!updateResponse.ok) {
        throw new Error("Failed to update investedValue");
      }
  
      console.log("Invested value updated successfully");
    } catch (error) {
      console.error("Error updating invested value:", error);
    }
  }
  async function updateFounderInvestedValue(newValue){
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups/${id}`;
  
    try {
      // Fetch the current user data
      const response = await fetch(url, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const jsonResponse = await response.json();
      
      // Get the current investedValue
      const currentInvestedValue = Number(jsonResponse.data.attributes.investmentReceived || 0);
      
      // Calculate the new total investedValue
      const updatedInvestedValue = currentInvestedValue + Number(newValue);
      
      // Prepare the body for the PUT request
      const updateData = {
        data: {
          investmentReceived: updatedInvestedValue,
        },
      };
      
      // Send a PUT request to update the user's investedValue
      const updateResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      if (!updateResponse.ok) {
        throw new Error("Failed to update investedValue");
      }
  
      console.log("Invested value updated successfully");
    } catch (error) {
      console.error("Error updating invested value:", error);
    }
  }
  const handleTransaction = async () => {
    setBtnText("Processing...");
    let ipfsImageHash = null;
    try {
      ipfsImageHash = await uploadImage(imageFile); // Upload the file and get the IPFS hash
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message);
    }

    const nftMetadata = {
      name: details.startupNname,
      descritpion: details.startupNname,
      image: `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsImageHash}`,
      attributes: [
        {
          trait_type: "Investment Amount",
          value: `$${amt}`,
        },
        {
          trait_type: "Price per Share",
          value: `$${details.pricePerShare}`,
        },
        {
          trait_type: "Number of Shares",
          value: `${Math.ceil(amt / details.pricePerShare)} shares `,
        },
      ],
    };

    let ipfsHash = null;
    try {
      ipfsHash = await uploadMetadata(nftMetadata);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message);
    }
    const weiValue = ethers.parseEther((amt * price).toString(), "ether");
    const tnxId = await writeContractAsync({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: contract_ABI,
      chainId: 11155111,
      functionName: "mintNFT",
      args: [ipfsHash, weiValue, details.address],
      value: weiValue,
    });
    updateInvestorDetails();
    setTnxid(tnxId);
  };

  const handleBuy = () => {
    if (amt < parseInt(details.minInvestment)) {
      toast.error("Investment amount can't be less than min investment");
    } else {
      console.log(amt, details.minInvestment);
      setShowNFTPage(true);
    }
  };

  const handleFirstBack = () => {
    setConfirmPage(false);
    setShowNFTPage(false); // Go back to the buy page
  };
  const handleSecondBack = () => {
    setConfirmPage(false);
    setShowNFTPage(true); // Go back to the buy page
  };
  const handleToConfirm = () => {
    setConfirmPage(true);
  };
  if (confirmed) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white text-gray-800 p-8 rounded-lg w-1/2 flex flex-col items-center relative">
          <ImCancelCircle
            onClick={handleOpen}
            className="absolute top-3 right-3 text-2xl cursor-pointer"
          />
          <h1 className="text-3xl font-bold">Congratulations 🎉</h1>
          <Lottie
            options={defaultOptions}
            height={200}
            width={200}
            speed={0.1}
          />
          <p className="text-xl mt-4 text-green-600">Purchase successful!</p>
          <p className="mt-4">
            You can view your NFT{" "}
            <a
              href={nftLink}
              target="_blank"
              className="text-green-600 hover:text-green-700"
            >
              here
            </a>
            .
          </p>
        </div>
      </div>
    );
  }
  if (confirmPage) {
    return (
      <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white text-gray-800 p-8 rounded-lg w-1/2">
          <FaArrowLeft
            className="text-2xl cursor-pointer"
            onClick={handleSecondBack}
          />
          <div className="my-4 text-center">
            <h1 className="text-3xl font-bold">
              {Math.ceil(amt / details.pricePerShare)} Shares
            </h1>
          </div>
          <div className="w-full mb-4">
            <div className="flex justify-between my-2">
              <p>Investment Amount</p>
              <p>${amt}</p>
            </div>
            <div className="flex justify-between my-2">
              <p>
                Fees <span className="text-xs text-gray-500">(?)</span>
              </p>
              <p>Free</p>
            </div>
            <div className="flex justify-between my-2 font-semibold">
              <p>Total Amount</p>
              <p>${amt}</p>
            </div>
            <div className="flex justify-between my-2 font-semibold">
              <p>Total Amount in ETH</p>
              <p className="flex items-center">
                <FaEthereum className="mr-2" />
                {(price * amt).toFixed(4)}
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between my-2">
              <p>Base Shares (Rounded Up)</p>
              <p>{Math.ceil(amt / details.pricePerShare)}</p>
            </div>
            <div className="flex justify-between my-2 font-semibold">
              <p>Total Shares</p>
              <p>{Math.ceil(amt / details.pricePerShare)}</p>
            </div>
            {btnText == "Processing..." && (
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <Grid
                  visible={true}
                  height="80"
                  width="80"
                  color="#48bb78"
                  ariaLabel="grid-loading"
                  radius="12.5"
                  wrapperStyle={{}}
                  wrapperClass="grid-wrapper"
                />
              </div>
            )}
          </div>
          <button
            onClick={handleTransaction}
            className="bg-green-500 text-white font-medium px-14 py-4 rounded hover:bg-green-600 duration-300 uppercase w-full mt-4"
          >
            {btnText}
          </button>
        </div>
      </div>
    );
  } else if (showNFTPage) {
    // Intermediate page content
    return (
      <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white text-gray-800 p-8 rounded-lg w-1/2">
          <FaArrowLeft
            className="text-2xl cursor-pointer"
            onClick={handleFirstBack}
          />
          <div className="text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              This is the{" "}
              <span className="text-green-600">Proof of Investment</span> NFT
              you get
            </h2>
            <div className="h-6"></div>
            <ImageWithDescription
              src={details.displayImg}
              description={`By acquiring this NFT, you agree to the Terms of Investment as stipulated by Raisecoin and are lawfully investing in ${details.startupName}. This token signifies your consent and represents proof of your investment made through Raisecoin.`}
              onImageProcessed={handleImageProcessed}
            />
            {imageUrl && (
              <div>
                <img
                  src={imageUrl}
                  alt="Processed Image"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            )}
            <button
              onClick={handleToConfirm}
              className="bg-green-500 text-white font-medium px-14 py-4 rounded hover:bg-green-600 duration-300 uppercase mt-4"
            >
              Let's Go
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        onClick={handleOpen}
        className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex flex-col items-start bg-white text-gray-800 p-8 rounded-lg w-1/2"
        >
          <div className="flex justify-between items-center w-full mb-4">
            <h2 className="text-2xl font-bold ">Invest Now</h2>
            <ImCancelCircle className="text-2xl" onClick={handleOpen} />
          </div>
          <h4>Min Investment : ${details.minInvestment}</h4>
          <div className="flex items-center gap-4">
            <label>Investment Amount (in USD)</label>
            <input
              type="number"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              className="flex-1 md:w-1/2 p-2 my-4 border border-gray-300 rounded "
            />
          </div>
          {amt < parseInt(details.minInvestment) && (
            <p className="text-sm text-red-500">
              *Investment amount can't be less than min investment
            </p>
          )}
          <button
            onClick={handleBuy}
            className="bg-green-500 text-white font-medium px-14 py-4 rounded hover:bg-green-600 duration-300 uppercase w-fit col-span-2 self-end"
          >
            Buy
          </button>
        </div>
      </div>
    );
  }
};

export default PopUp;
