"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import contract_ABI from "../../../../../Smart-contract/contractABI";
import { FaAngleDown, FaUpload, FaFileAlt, FaU } from "react-icons/fa6";
import { uploadDocument } from "../../../../utils/uploadDocument";
import toast from "react-hot-toast";

const page = () => {
  const [investors, setInvestors] = useState([]);
  const { address, isConnected } = useAccount();
  const [selectedFile, setSelectedFile] = useState("");

  const fileInputRef = React.createRef();

  const { data: founderID } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: contract_ABI,
    chainId: 11155111,
    functionName: "getFounderID",
    args: [address],
  });
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups/${founderID}`;
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse, "res");
        if (jsonResponse.data) {
          if (jsonResponse.data.attributes.investorDetail != null) {
            setInvestors(jsonResponse.data.attributes.investorDetail);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, [founderID]);

  const onFileSelect = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  async function handleDocStatusChange(index, newStatus, docStatus, id) {
    if(newStatus === "Issued" && selectedFile === ""){
      alert("Please upload the document");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups/${founderID}`;
    if (docStatus != newStatus) {
      let ipfsDocHash = null;
      try {
        ipfsDocHash = await uploadDocument(selectedFile); // Upload the file and get the IPFS hash
      } catch (error) {
        console.error("Error uploading file:", error);
        alert(error.message);
      }
      try {
        // Fetch the current data of the startup
        const response = await fetch(url, {
          method: "GET",
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse, "res");

        // Update the document status in the investor details
        const docLink = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsDocHash}`;
        const updatedInvestorDetails =
          jsonResponse.data.attributes.investorDetail.map((investor, i) => {
            if (i === index) {
              return { ...investor, document: docLink, docStatus: newStatus };
            }
            return investor;
          });

        // Prepare the body for the PUT request with the entire updated startup data
        const updateData = {
          ...jsonResponse.data, // spread the existing startup data
          investorDetail: updatedInvestorDetails, // updated investor details
        };

        // Send a PUT request to update the entire startup entry
        const updateResponse = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: updateData }),
        });
        handleUserStatusChange(id, docLink);

        if (!updateResponse.ok) {
          throw new Error("Failed to update document status");
        }
        toast.success("Document Uploaded successfully")
        console.log("Document status updated successfully");
      } catch (error) {
        console.error("Error updating document status:", error);
        toast.error("Error Uploading Document Please Retry!")  
      }
    }
  }
  async function handleUserStatusChange(id, docLink) {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${id}`;
    try {
      // Fetch the current data of the startup
      const response = await fetch(url, {
        method: "GET",
      });
      const jsonResponse = await response.json();

      // Update the document status in the investor details
      const updatedInvestmentDetails =
        jsonResponse.data.attributes.investmentDetail.map((startup, i) => {
          if (founderID == startup.startupID) {
            console.log(startup, "start");
            return { ...startup, document: docLink, status: "Approved" };
          }
          return startup;
        });

      // Prepare the body for the PUT request with the entire updated startup data
      const updateData = {
        ...jsonResponse.data, // spread the existing startup data
        investmentDetail: updatedInvestmentDetails, // updated investor details
      };

      // Send a PUT request to update the entire startup entry
      const updateResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: updateData }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update document status");
      }

      console.log("Document status updated successfully");
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  }

  return (
    <div className="overflow-hidden shadow-md rounded-lg">
      <table className="min-w-full leading-normal text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount in USD
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Shares Owned
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount in ETH
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Document
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Legal Documents Status
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Payment Status
            </th>
          </tr>
        </thead>
        <tbody>
          {investors.map((investor, index) => (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {new Date(investor.date).toLocaleDateString()}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {investor.name}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {investor.amount}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {investor.shares}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {investor.ethPaid}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                {investor.document != "" ? (
                  <a
                    href={investor.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-0.5 py-1 bg-white border border-gray-300 rounded text-green-600 text-sm cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    View Document
                  </a>
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={onFileSelect}
                    />
                    <button
                      className="flex items-center justify-center px-3 py-1 bg-white border border-gray-300 rounded text-green-600 text-sm cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Upload
                      <FaUpload className="ml-2" />
                    </button>
                    {selectedFile && (
                      <div className="mt-2 text-gray-700">
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                )}
              </td>

              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left">
                <div className="relative inline-block w-10/12 text-gray-700">
                  <select
                    onChange={(e) =>
                      handleDocStatusChange(
                        index,
                        e.target.value,
                        investor.docStatus,
                        investor.userID
                      )
                    }
                    className="w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
                    style={{ backgroundColor: "#81E6D9", color: "black" }}
                  >
                    <option value={investor.docStatus}>
                      {investor.docStatus}
                    </option>
                    <option
                      value={
                        investor.docStatus === "Pending" ? "Issued" : "Pending"
                      }
                    >
                      {investor.docStatus === "Pending" ? "Issued" : "Pending"}
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaAngleDown className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {investor.paymentStatus === "Rejected" ? (
                  <span
                    className="text-red-500 cursor-pointer"
                    title="Transaction was rejected by the investor. Transaction amount is sent back to investor"
                  >
                    Rejected
                  </span>
                ) : investor.paymentStatus === "Approved" ? (
                  <span
                    className="text-green-500 cursor-pointer"
                    title="The Transaction was approved by the investor. Transaction amount is sent to your wallet address"
                  >
                    Approved
                  </span>
                ) : investor.paymentStatus === "In Transit" ? (
                  <span
                    className="text-orange-500 cursor-pointer"
                    title="In transit, transaction is under review by the investor."
                  >
                    In Transit
                  </span>
                ) : (
                  <span className="text-gray-500 cursor-pointer">
                    Unknown Status
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default page;
