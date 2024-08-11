import React,{useState,useEffect} from "react";

import StockWidget from "./StockWidget";

const ClosingSoon = ({ title }) => {
	const [data, setData] = useState([]);
	

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
					endDate: item.attributes.endDate,
					summary: item.attributes.summary
                }))
				.sort((a, b) => new Date(a.endDate) - new Date(b.endDate)) // Sort by endDate ascending
                .slice(0, 3);
				
                setData(transformedData);
				console.log(data);
				setTotalEntries(data.meta.pagination.total);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []); 
	return (
		<div className="w-full bg-gray-100 ">
			<div className="w-4/5 m-auto py-14">
				<h1 className="text-3xl text-gray-700 font-semibold text-left pb-10">
					{title}
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-7">
					{data.map((e, index) => (
						<StockWidget key={index} id={e.id} image={e.image} name={e.name} summary={e.summary} isClosingSoon={true} endDate={e.endDate}/>
					))}
				</div>
			</div>
		</div>
	);
};


export default ClosingSoon;
