'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';

const FlipCard = ({ nft }) => {
    console.log(nft)
    const [isFlipped, setIsFlipped] = useState(true);
    const [metadata, setMetadata] = useState(null);
    const [investmentAmount, setInvestmentAmount] = useState("");
    const [pricePerShare, setPricePerShare] = useState("");
    const [numberOfShares, setNumberOfShares] = useState("");
    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };
    useEffect(() => {
        fetchMetadata();

    }, [nft]);
    async function fetchMetadata() {
        try {
            const response = await fetch(nft.metadata_url);
            console.log(nft,"nft")
            if (!response.ok) {
                new Error(`Failed to fetch metadata, status: ${response.status}`);
            }
            const metadata = await response.json();
            // console.log("met", metadata.attributes[0].value)
            setMetadata(metadata);
            setInvestmentAmount(metadata.attributes[0].value)
            setPricePerShare(metadata.attributes[1].value)
            setNumberOfShares(metadata.attributes[2].value)
        } catch (error) {
            console.error('Error fetching metadata:', error);
            throw error; // You can handle this error appropriately in your application
        }
    }

    const openUrlInNewWindow = () => {
        // Open the URL in a new window
        console.log(metadata)
        window.open(nft.opensea_url, '_blank');
    };


    return (
        <>
            {metadata
                ? <>
                    <div className="relative w-full aspect-square cursor-pointer" onClick={openUrlInNewWindow} onMouseEnter={() => { flipCard() }} onMouseLeave={() => { flipCard() }}>
                        <div className={`absolute w-full aspect-square bg-transparent`}>
                            <div className={`absolute inset-0 w-full aspect-square rounded-lg shadow-lg bg-blue-500 flex justify-center items-center ${isFlipped ? 'scale-x-100 z-10' : '-scale-x-100 z-0'} duration-500`}>
                                <Image
                                    src={nft.image_url}
                                    height={700}
                                    width={700}
                                    alt=""
                                    className="w-full"
                                />
                            </div>
                            <div className={`absolute inset-0 w-full h-full rounded-lg shadow-lg bg-white flex flex-col whitespace-pre-wrap justify-center items-center ${isFlipped ? '-scale-x-100 z-0' : 'scale-x-100 z-10'} duration-500`}>
                                <span className="text-green-500 font-bold text-lg">Invested Amount: {investmentAmount} </span>
                                <span className="text-green-500 font-bold text-lg">Price Per Share: {pricePerShare}</span>
                                <span className="text-green-500 font-bold text-lg">{numberOfShares} </span>
                            </div>
                        </div>
                    </div>
                </> :
                <></>

            }
        </>
    )
}

export default FlipCard