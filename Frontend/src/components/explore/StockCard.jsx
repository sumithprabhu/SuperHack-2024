import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEthereum } from "react-icons/fa6";
import { end } from "@popperjs/core";

const StockCard = ({
  id,
  image,
  name,
  subtitle,
  amtRaised,
  noOfInvestors,
  minInvestment,
  link,
  endDate,
}) => {
  console.log(image);
  const numberFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options).split(" ");

    // Applying ordinal suffix to the day
    const dayWithSuffix = getOrdinalSuffix(formattedDate[0]);
    // Reassembling the date with the correct format "15th May 2024"
    return `${dayWithSuffix} ${formattedDate[1]} ${formattedDate[2]}`;
  }

  function getOrdinalSuffix(day) {
    const dayNum = parseInt(day, 10);
    if (dayNum > 3 && dayNum < 21) return day + "th"; // Handle special case for "teens"
    switch (dayNum % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }
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

  return (
    <div className="bg-gray-100 shadow-md w-full text-black rounded-xl border border-gray-300">
      <div className="w-full rounded-t-xl flex justify-center items-center relative">
        <Image
          src={image}
          height={300}
          width={400}
          alt=""
          className="w-full aspect-video rounded-t-xl object-cover"
        />
		
        <div className="absolute bottom-0 right-4 cursor-pointer bg-green-500 rounded-lg translate-y-[50%] px-3 py-0.5 flex justify-center items-center">
          <span className="text-lg text-white font-bold">
            {calculateDaysLeft(endDate)} days left
          </span>
        </div>
		
      </div>
      <div className="flex flex-col justify-center items-start p-4">
        <p className="text-xl text-gray-900 font-bold pb-1">{name}</p>
        <p className="text-sm text-gray-500 pb-3">{subtitle}</p>
        <div className="w-full border-t border-gray-900 border-dashed pb-3" />
        <div className="grid grid-cols-3 pb-3">
          <div>
            <p className="text-sm text-green-500 font-bold flex items-center gap-0.5">
              ${numberFormatter.format(amtRaised)}
            </p>
            <p className="text-sm text-gray-500">Raised</p>
          </div>
          <div>
            <p className="text-sm text-green-500 font-bold">{noOfInvestors}</p>
            <p className="text-sm text-gray-500">Investors</p>
          </div>
          <div>
            <p className="text-sm text-green-500 font-bold flex items-center gap-0.5">
              ${numberFormatter.format(minInvestment)}
            </p>
            <p className="text-sm text-gray-500">Min. Investment</p>
          </div>
        </div>
        <div className="flex justify-between w-full items-center">
          {/* <p className="text-sm text-gray-500">Expiry: <span className="text-sm text-green-500 font-bold">{endDate}</span></p> */}
          <div>
            <p className="text-sm text-green-500 font-bold flex items-center gap-0.5">
              {formatDate(endDate)}
            </p>
            <p className="text-sm text-gray-500">Expiry</p>
          </div>
          <Link
            href={`/explore/${id}`}
            className="bg-[#023047] text-white text-sm px-6 py-1.5 rounded-lg"
          >
            More Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
