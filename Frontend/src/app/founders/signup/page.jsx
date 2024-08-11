"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {useAccount,useWaitForTransactionReceipt,useWriteContract,
} from "wagmi";
import toast from "react-hot-toast";
import { uploadImage } from '../../../utils/uploadImage';
import contract_ABI from "../../../../Smart-contract/contractABI";
import { useRouter } from "next/navigation";


const page = () => {
  const [isClient, setIsClient] = useState(false);
  const [ventureName, setVentureName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [file, setFile] = useState("");
  const [imageHash, setImageHash] = useState("");
  const { address } = useAccount();
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [btnData, setBtnData] = useState("Enroll Now");
  const router = useRouter()


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !ventureName || !officialEmail) {
      toast.error("Fill entire form");
    }
    setBtnData("Submitting...");
    let ipfsHash= null;
    try {
      ipfsHash = await uploadImage(file); // Upload the file and get the IPFS hash
      //setImageHash(ipfsHash); // Store the IPFS hash in state
      //alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message);
    }
    const payload = {
      data: {
        startupName:ventureName,
        email: officialEmail, 
        address: address,
        displayImg: `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`
      },
    };

   
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const jsonResponse = await response.json(); // Parse JSON response
        console.log("Signup successful. ID:", jsonResponse.data.id);

        await writeContractAsync({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          abi: contract_ABI,
          chainId: 11155111,
          functionName: "registerFounder",
          args: [jsonResponse.data.id],
        });
        console.log("Signup successful");
        toast.success("Profile Created");
        setTimeout(function () {
          router.push("/founders/portfolio/profile");
        }, 3000);
      } else {
        console.log("Signup failed", response);
        toast.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(`Error during signup: ${error.message}`);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {!isClient ? (
        <></>
      ) : (
        <div className="min-h-screen flex flex-col items-center bg-white">
  <div className="w-full bg-gray-800 py-3">
    <div className="flex justify-between items-center w-[87%] mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logoWhite.png"
            width={400}
            height={100}
            alt="Logo"
            className="w-40"
          />
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-9"></div>
      <div className="md:hidden flex items-center">
        <button className="outline-none mobile-menu-button">
          <svg
            className="w-6 h-6 text-gray-500 hover:text-green-600"
            x-show="!showMenu"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div className="w-full flex justify-center items-center mt-8">
    <Head>
      <title>Register</title>
    </Head>

    <div className="container py-8 w-[80%] max-w-2xl bg-white shadow-lg rounded-lg px-6 border-2 border-green-600">
      <h1 className="text-sm md:text-xl font-bold text-center text-gray-800 mb-4">
        Raise your round with the best! <br />
        <span className="text-2xl md:text-3xl text-green-600">Become a RaiseCoin Investor!</span>
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        Already a member?{" "}
        <a href="/founders/signin" className="text-green-600">
          Sign in.
        </a>
      </p>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            className="block text-gray-800 text-sm font-bold mb-2"
            htmlFor="venture-name"
          >
            Name of your Venture
          </label>
          <input
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline border-green-600 rounded"
            id="venture-name"
            type="text"
            placeholder="E.g. Vilson Hydrations"
            value={ventureName}
            onChange={(e) => setVentureName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-800 text-sm font-bold mb-2"
            htmlFor="official-email"
          >
            Official Email
          </label>
          <input
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline border-green-600 rounded"
            id="official-email"
            type="email"
            placeholder="email@example.com"
            value={officialEmail}
            onChange={(e) => setOfficialEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-bold mb-2">
            Upload Image
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded-lg py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline border-green-600 rounded"
          />
        </div>


        <div className="flex items-center justify-around mt-6">
        <ConnectButton
          chainStatus="none"
          label="Connect wallet"
          showBalance={false}
        />
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {btnData}
          </button>
          
        </div>
      </form>
    </div>
  </div>
</div>


      )}
    </>
  );
};

export default page;

// image upload example
// "use client"

// import { useState } from 'react';
// import { uploadImage } from '../../../utils/uploadImage'; // Adjust the path as necessary

// export default function Home() {
//     const [file, setFile] = useState(""); // State to hold the selected file
//     const [uploading, setUploading] = useState(false); // State to manage upload status
//     const [ipfsHash, setIpfsHash] = useState(''); // State to store the returned IPFS hash

//     // Handler for file selection
//     const handleFileChange = (event) => {
//         setFile(event.target.files[0]);
//     };

//     // Handler for form submission
//     const handleSubmit = async (event) => {
//         event.preventDefault(); // Prevent the default form submit action
//         if (!file) {
//             alert('Please select a file first!');
//             return;
//         }

//         setUploading(true); // Indicate that uploading has started
//         try {
//             const ipfsHash = await uploadImage(file); // Upload the file and get the IPFS hash
//             setIpfsHash(ipfsHash); // Store the IPFS hash in state
//             alert('File uploaded successfully!');
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             alert(error.message);
//         } finally {
//             setUploading(false); // Reset the uploading status
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//             <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg">
//                 <div className="mb-4">
//                     <label htmlFor="fileUpload" className="block text-gray-700 text-sm font-bold mb-2">
//                         Choose file:
//                     </label>
//                     <input
//                         type="file"
//                         id="fileUpload"
//                         onChange={handleFileChange}
//                         disabled={uploading}
//                         className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     />
//                     {file && <span className="text-sm text-gray-600">{file.name}</span>}
//                 </div>
//                 <button
//                     type="submit"
//                     disabled={uploading || !file}
//                     className={`mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading || !file ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                     {uploading ? 'Uploading...' : 'Upload to IPFS'}
//                 </button>
//             </form>
//             {ipfsHash && (
//                 <div className="mt-4 text-center">
//                     <p>IPFS Hash:
//                         <a
//                             href={`https://ipfs.io/ipfs/${ipfsHash}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-500"
//                         >
//                             {ipfsHash}
//                         </a>
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// }
