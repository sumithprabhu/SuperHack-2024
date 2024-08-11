"use client"
import React, { useEffect, useState } from 'react'
import FlipCard from "@/components/profile/FlipCard";
import { useAccount } from 'wagmi';
import { CSpinner } from '@coreui/react';


const page = () => {
    const { address } = useAccount();
    const [nfts, setNfts] = React.useState([""]);
    useEffect(() => {
        fetchNFTsByAccount();

    }, []);
    async function fetchNFTsByAccount() {
        try {
            const apiKey = '28e5d6a496124f30be51f1eeaa286ead'; // Replace 'YOUR_API_KEY' with your actual OpenSea API key
            const apiUrl = `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${address}/nfts?collection=raisecoin`;
            const response = await fetch(apiUrl, {
                headers: {
                    'X-API-KEY': apiKey
                }
            });
            if (!response.ok) {
                new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setNfts(data.nfts)
            console.log(data.nfts)

        } catch (error) {
            console.error('Error fetching NFTs:', error);

        }
    }


    return (
        <div className="max-h-[62vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <h1 className='text-xl font-bold mb-4'>Your NFTS</h1>
            <div className='grid grid-cols-3 w-full gap-6'>
                {nfts.length > 0 ?
                    <>
                        {nfts.map((nft, index) => (
                            <FlipCard key={index} nft={nft} />
                        ))}</> :
                    <div className='flex justify-center items-center text-green-500 w-full h-[80vh]'>
                        <CSpinner color="success" />
                        {/* <p>Loading...</p> */}
                    </div>

                }
            </div>
        </div>

    )
}

export default page