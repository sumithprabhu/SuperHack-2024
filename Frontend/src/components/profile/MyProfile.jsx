'use client'
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount ,useReadContract} from 'wagmi';
import contract_ABI from "../../../Smart-contract/contractABI";

const MyProfile = () => {
	const [read, setRead] = useState(true)
	const [loading, setLoading] = useState(true)
	const [first, setFirst] = useState('')
	const [email, setEmail] = useState('')
	const [ph, setPh] = useState('')
	const [btnText, setBtnText] = useState("Update");
	const { address ,isConnected } = useAccount();
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
				console.log(jsonResponse, "res")
				if (jsonResponse.data) {
					setFirst(jsonResponse.data.attributes.name)
					setEmail(jsonResponse.data.attributes.email)
					setPh(jsonResponse.data.attributes.number)
				}
				setLoading(false)
			}
			catch (error) {
				console.error("Error fetching data:", error);
				toast.error(`Error fetching data: ${error.message}`);
			}
		}
		fetchData()
	}, [userID])

	const handleSubmit = async () => {
		setBtnText("Submitting...");
		const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/profiles/${userID}`;
		const payload = {
			data: {
				name: first,
				number: ph, // Assuming 'mobile' should be sent as 'number'
				email: email,
			},
		};
		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (response.ok) {
				toast.success("Updated Successfully!!")
			}
			setBtnText('Update')
		} catch (error) {
			console.error("Error during update:", error);
			toast.error(`Error during update: ${error.message}`);
		}
		setRead(true)
	}


	return (
		<div className="flex flex-col">

			<div className="flex justify-between items-start w-full">
				<p className="font-bold text-2xl text-green-600 mb-5">Profile Overview</p>
				{read && <button onClick={() => { setRead(false) }} className="px-3 py-1 bg-green-300 text-green-600 font-bold text-sm rounded-lg hover:text-white hover:bg-green-600 duration-300">Edit</button>}
			</div>
			{!loading && <>
				<div className="grid gap-6 mb-6 md:grid-cols-2">
					<div>
						<label
							htmlFor={'first_name'}
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Name
						</label>
						<input
							type={'text'}
							value={first}
							onChange={(e) => { setFirst(e.target.value) }}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							readOnly={read}
							required
						/>
					</div>
					<div>
						<label
							htmlFor={"email"}
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							{'Email address'}
						</label>
						<input
							type={"email"}
							value={email}
							onChange={(e) => { setEmail(e.target.value) }}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							readOnly={read}
							required
						/>
					</div>
					<div>
						<label
							htmlFor={'phone'}
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							{'Phone Number'}
						</label>
						<input
							type={"number"}
							value={ph}
							onChange={(e) => { setPh(e.target.value) }}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							pattern={"[0-9]{3}-[0-9]{2}-[0-9]{4}"}
							readOnly={read}
							required
						/>
					</div>
				</div>
				{!read && <div className="w-full md:col-span-2 flex justify-start">
					<button className="bg-blue-700 text-white py-2 px-4" onClick={handleSubmit}>{btnText}</button>
				</div>}
			</>
			}
		</div>
	);
};

export default MyProfile;
