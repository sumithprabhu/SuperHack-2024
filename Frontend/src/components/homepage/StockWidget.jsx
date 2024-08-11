import React from 'react'
import Image from "next/image";
import Link from 'next/link';

const StockWidget = ({id,image,name,summary,isClosingSoon,endDate}) => {
    function calculateDaysLeft(endDate) {
        // Parse the endDate to a Date object
        const end = new Date(endDate);
    
        // Get the current date and time
        const start = new Date();
    
        // Calculate the difference in milliseconds
        const difference = end - start;
    
        // Convert the difference from milliseconds to days
        const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));
    
        // Return the number of days left
        return daysLeft > 0 ? daysLeft : 0; // Ensure non-negative days left
    }

    function truncateText(text) {
        if (text.length > 85) {
            return text.substring(0, 85) + '...';
        }
        return text;
    }
    return (
        <div className="bg-gray-50 w-full text-black rounded-xl border border-gray-300">
            <div className="w-full rounded-t-xl flex justify-center items-center">
                <Image
                    src={image}
                    height={300}
                    width={400}
                    alt=""
                    className="w-full aspect-video rounded-t-xl object-cover"
                />
            </div>
            <div className="flex flex-col justify-center items-center p-4">
                <p className="text-xl font-semibold self-start pb-1">{name}</p>
                <p className='text-gray-500 pb-4 text-sm '>{truncateText(summary)}</p>
                <div className="flex justify-between w-full items-center">
    {isClosingSoon ? (
        <div className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg">
            {calculateDaysLeft(endDate)} days left
        </div>
    ) : (
        <div style={{ width: '160px' }}> {/* Use an empty div with a fixed width matching the 'days left' div */}
        </div>
    )}
    <Link href={`/explore/${id}`} className="bg-[#023047] text-white text-sm px-6 py-2 rounded-lg">
        More Details
    </Link>
</div>

            </div>
        </div>
    )
}

export default StockWidget