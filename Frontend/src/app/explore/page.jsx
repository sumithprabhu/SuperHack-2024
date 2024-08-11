"use client"
import StockCard from '@/components/explore/StockCard';
import StockWidget from '@/components/homepage/StockWidget'
import { CSpinner } from '@coreui/react';
import React, { useEffect, useState } from 'react'

const page = () => {

	const [data, setData] = useState([]);
	const [totalEntries, setTotalEntries] = useState(0);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups`)
			.then(response => response.json())
			.then(data => {
				const transformedData = data.data.map(item => ({
					id: item.id,
					image: item.attributes.displayImg, // Static image, consider dynamic handling if needed
					name: item.attributes.startupName,
					subtitle: item.attributes.subtitle,
					raised: item.attributes.currentFunding, // Adjust formatting as needed
					investors: item.attributes.noInvestors,
					mininvestment: item.attributes.minInvestment,
					endDate: item.attributes.endDate
				}));
				setData(transformedData);
				setTotalEntries(data.meta.pagination.total);
			})
			.catch(error => console.error('Error fetching data:', error));
	}, []);

	return (
		<div className="w-full bg-gray-50 min-h-screen">
			<div className="w-3/4 m-auto py-14">
				{data.length > 0 ? <>
					<h1 className="text-2xl text-green-500 font-semibold text-left pb-10">
						{totalEntries} Current Funding Rounds
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-7">
						{data.map((e, index) => (
							<StockCard
								key={index}
								id={e.id}
								image={e.image}
								name={e.name}
								subtitle={e.subtitle}
								amtRaised={e.raised}
								noOfInvestors={e.investors}
								minInvestment={e.mininvestment}
								endDate={e.endDate}
							/>
						))}
					</div></>
					: <div className='flex justify-center items-center text-green-500 w-full h-[80vh]'>
						<CSpinner color="success" />
						{/* <p>Loading...</p> */}
					</div>
				}
			</div>
		</div>
	)
}


export default page;
