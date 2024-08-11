"use client";
import CompWrapper from "@/components/Utils/CompWrapper";
import PopUp from "@/components/Utils/PopUp";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CSpinner } from "@coreui/react";
import { FaEthereum } from "react-icons/fa6";

const page = ({ params }) => {
  const [open, setOpen] = useState(false);
  const id = params.id;
  const handleOpen = () => {
    setOpen(!open);
  };

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/startups/${id}?populate=*`
      )
        .then((response) => response.json())
        .then((data) => {
          setDetails(data.data.attributes);

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);

          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CSpinner color="success" />
      </div>
    );
  }
  if (!details) {
    console.log("detailes not found");
    return (
      <div className="flex flex-col justify-center items-center h-svh bg-gray-50 text-green-500">
        <img src="/error.png" alt="Error" className="w-80 h-64 mb-4" />
        <p className="text-xl font-semibold">Details not found.</p>
      </div>
    );
  }
  const numberFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <CompWrapper>
        <div className="w-4/5 flex flex-col items-start mx-auto py-10 md:py-28 text-gray-900 ">
          <p className="text-green-500 text-lg tracking-wide font-medium">
            {details.subtitle}
          </p>
          <h2 className="text-gray-900 text-5xl font-bold mt-4 mb-5">
            {details.startupName}
          </h2>
          <div className="w-full border-t border-gray-300 mb-3"></div>
          <div className=" flex justify-center gap-5 items-start w-full">
            <div className="w-1/2 md:w-[60%]">
              <span className="text-green-500 text-lg font-medium  ">
                Summary
              </span>
              <p className="text-justify py-5 ">{details.summary}</p>
            </div>
            <Image
              src={details.displayImg}
              height={300}
              width={400}
              alt=""
              className="w-1/2 md:w-[40%] md:ml-auto my-auto aspect-video rounded-xl object-contain"
            />
          </div>

          <div className="w-full md:grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 pb-10">
            <button
              onClick={handleOpen}
              className="bg-green-500 text-white font-medium px-14 py-4 rounded hover:bg-green-600 duration-300 self-center uppercase w-fit col-span-2"
            >
              Invest Now
            </button>
            <div className="w-full bg-white rounded-md shadow cursor-pointer flex gap-4 justify-between items-center  px-6 py-4">
              <span className="text-gray-900 uppercase font-light">
                Previous Funding
              </span>
              <span className="text-green-500 text-lg flex items-center gap-0.5">
                ${numberFormatter.format(details.previousFunding)}
              </span>
            </div>
            <div className="w-full bg-white rounded-md shadow cursor-pointer flex gap-4 justify-between items-center  px-6 py-4">
              <span className="text-gray-900 uppercase font-light">
                Currently rasied
              </span>
              <span className="text-green-500 text-lg flex items-center gap-0.5">
                ${numberFormatter.format(details.currentFunding)}
              </span>
            </div>
            <div className="w-full bg-white rounded-md shadow cursor-pointer flex gap-4 justify-between items-center  px-6 py-4">
              <span className="text-gray-900 uppercase font-light">
                Investors
              </span>
              <span className="text-green-500 text-lg">
                {details.noInvestors}
              </span>
            </div>
            <div className="w-full bg-white rounded-md shadow cursor-pointer flex gap-4 justify-between items-center  px-6 py-4">
              <span className="text-gray-900 uppercase font-light">
                Min. investment
              </span>
              <span className="text-green-500 text-lg flex items-center gap-0.5">
                ${details.minInvestment}
              </span>
            </div>
          </div>
          <h3 className="text-center text-3xl text-green-500 w-full mt-10 pb-5">
            Company Overview
          </h3>
          <p
            className="w-full text-justify text-gray-500 md:px-10"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {details.overview}
          </p>
        </div>
        {open && <PopUp handleOpen={handleOpen} details={details} id={id} />}
      </CompWrapper>
      <div></div>
    </div>
  );
};

export default page;
