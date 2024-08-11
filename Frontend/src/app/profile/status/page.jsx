"use client";
import React, { useState, useEffect } from "react";
import contract_ABI from "../../../../Smart-contract/contractABI";
import { FaAngleDown, FaUpload, FaFileAlt } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";

const InvestmentView = () => {
  const [investments, setInvestments] = useState([]);
  const { address, isConnected } = useAccount();
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  const { data: userID } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: contract_ABI,
    chainId: 11155111,
    functionName: "getUserID",
    args: [address],
  });

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${userID}`;
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse, "res");
        if (jsonResponse.data) {
          if (jsonResponse.data.attributes.investmentDetail != null) {
            setInvestments(jsonResponse.data.attributes.investmentDetail);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userID]);

  const revertTransaction = async () => {
    await writeContractAsync({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: contract_ABI,
      chainId: 11155111,
      functionName: "revertFunds",
      args: [selectedInvestment.nftId],
    });
    changeUserPaymentStatus("Rejected");
    changeFounderPaymentStatus("Rejected");
    setShowRejectPopup(false);
    setIsVisible(true);
  };

  const approveTransaction = async () => {
    await writeContractAsync({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: contract_ABI,
      chainId: 11155111,
      functionName: "claimFunds",
      args: [selectedInvestment.nftId],
    });
    changeUserPaymentStatus("Approved");
    changeFounderPaymentStatus("Approved");
    setShowApprovePopup(false);
    setIsVisible(true);
  };

  const changeUserPaymentStatus = async (status) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${userID}`;
    try {
      // Fetch the current data of the startup
      const response = await fetch(url, {
        method: "GET",
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse, "res");

      const updatedInvestmentDetails =
        jsonResponse.data.attributes.investmentDetail.map((investor, i) => {
          if (investor.startupID == selectedInvestment.startupID) {
            return { ...investor, paymentStatus: status };
          }
          return investor;
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
  };

  const changeFounderPaymentStatus = async (status) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups/${selectedInvestment.startupID}`;
    try {
      // Fetch the current data of the startup
      const response = await fetch(url, {
        method: "GET",
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse, "res");

      const updatedInvestorDetails =
        jsonResponse.data.attributes.investorDetail.map((investor, i) => {
          if (investor.userID == userID) {
            return { ...investor, paymentStatus: status };
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

      if (!updateResponse.ok) {
        throw new Error("Failed to update document status");
      }

      console.log("Document status updated successfully");
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  const isRejectButtonEnabled = (investment) => {
    const currentDate = new Date();
    const investmentDate = new Date(investment.dateOfPurchase);
    const daysSinceInvestment = Math.ceil(
      (currentDate - investmentDate) / (1000 * 60 * 60 * 24)
    );

    return !investment.document && daysSinceInvestment >= 30;
  };

  const getDaysUntilUnlock = (investment) => {
    const currentDate = new Date();
    const investmentDate = new Date(investment.dateOfPurchase);
    const daysUntilUnlock =
      30 - Math.ceil((currentDate - investmentDate) / (1000 * 60 * 60 * 24));

    return daysUntilUnlock;
  };

  return (
    <div className="overflow-hidden shadow-md rounded-lg">
      {showApprovePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Confirm Approval
            </h2>
            <p className="mb-4 text-black">
              Are you sure you want to approve the investment from{" "}
              {selectedInvestment.companyNamed}?
            </p>
            <p className="mb-4 text-red-700">
              Note: Once approved the transfer funds will initaite which cannot
              be reverted.
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={() => setShowApprovePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                onClick={() => {
                  approveTransaction();
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Confirm Rejection
            </h2>
            <p className="mb-4 text-black">
              Are you sure you want to reject the investment from{" "}
              {selectedInvestment.companyNamed}?
            </p>
            <p className="mb-4 text-red-700">
              Note: You will receive the exact ETH amount paid and the process
              will terminate
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={() => setShowRejectPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => {
                  revertTransaction();
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full leading-normal text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Startup Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount in ETH
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Document
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment, index) => (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {new Date(investment.dateOfPurchase).toLocaleDateString()}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {investment.companyNamed}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left text-gray-900">
                {investment.shareValueInEth}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                {investment.document ? (
                  <a
                    href={investment.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-0.5 py-1 bg-white border border-gray-300 rounded text-green-600 text-sm cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    View Document
                  </a>
                ) : (
                  <span className="text-black">Nothing Issued yet</span>
                )}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-left">
                {investment.document && investment.paymentStatus=="In Transit" ? (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    onClick={() => {
                      setSelectedInvestment(investment);
                      setShowApprovePopup(true);
                    }}
                  >
                    Approve
                  </button>
                 ) : investment.paymentStatus === "Rejected" ? (
                    <span className="text-red-500 cursor-pointer" title="Rejected by you, hence transcation was canceled. Transaction amount is reverted to your wallet">Rejected</span>
                  ) : investment.paymentStatus === "Approved" ? (
                    <span className="text-green-500 cursor-pointer" title="Approved by you, hence transcation was approved. Transaction amount is transfered to startup">Approved</span>
                  ) : (
                  <button
                    className={`px-4 py-2 text-white rounded ${
                      isRejectButtonEnabled(investment)
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-red-500 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      setSelectedInvestment(investment);
                      setShowRejectPopup(true);
                    }}
                    disabled={!isRejectButtonEnabled(investment)}
                    title={
                      !isRejectButtonEnabled(investment)
                        ? `Will unlock in ${getDaysUntilUnlock(
                            investment
                          )} days`
                        : ""
                    }
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-lg font-semibold text-black mr-2">
                Process Initiated
              </h2>
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>{" "}
            <p className="mb-4 text-black">
              The process has been successfully initiated.
            </p>
            <p className="mb-4 text-black">
              Note: The process will require few minutes to reflect.
            </p>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 mt-4"
              onClick={() => setIsVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentView;
