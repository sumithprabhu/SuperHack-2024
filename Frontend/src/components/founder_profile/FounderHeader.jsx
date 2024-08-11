"use client"
import Image from "next/image";
import React ,{useState,useEffect} from "react";
import { FaPen, FaEthereum } from "react-icons/fa6";
import { useReadContract ,useAccount} from "wagmi";
import contract_ABI from "../../../Smart-contract/contractABI";
import { number } from "prop-types";


const FounderHeader = () => {
	const { address } = useAccount();
	const [amt, setAmt] = useState(0);
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
        if (jsonResponse.data) {
          setAmt(jsonResponse.data.attributes.investmentReceived);
		  
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData()
	
},[founderID])

const numberFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });
	return (
		<div className="h-[18vh] shadow-2xl w-full flex justify-between rounded-2xl mb-10 relative overflow-hidden">
			{/* Banner Image */}
			<div
				className="absolute inset-0 bg-[url(/baner.jpg)] bg-cover bg-center opacity-75"
				style={{ filter: "brightness(0.9)" }}></div>

			{/* Overlay */}
			<div className="absolute inset-0 bg-green-600 opacity-25"></div>

			<div className="flex flex-col items-start my-auto ml-20 relative z-10">
				<p className="text-s font-semibold pl-9">Raised</p>
				<p className="flex text-4xl font-bold">$ {numberFormatter.format(amt)}</p>
			</div>

			<div className="flex items-center my-auto mx-4 relative z-10">
				{/* Name */}
				{/* <p className="mr-4 font-bold text-2xl text-white">StartUp Name</p> */}
				{/* Profile pic */}
				<div className="group relative aspect-square w-full flex justify-center items-center overflow-clip rounded-full ">
					<button
						onClick={"#"}
						className="opacity-100 flex items-center invisible group-hover:visible absolute z-10 py-1 px-2 rounded-xl bg-green-600">
						<FaPen className="pr-1" />
						edit
					</button>
					<Image
						width={100}
						height={100}
						src="/metamask.png"
						className="group-hover:opacity-40"
						alt=""
					/>
				</div>
			</div>
		</div>
	);
};

export default FounderHeader;
