import React from 'react'
import CompWrapper from '../Utils/CompWrapper'
import Image from 'next/image'

const HomeBanItems = ({ title, desc }) => {
    return (
        <div className='flex flex-col items-start'>
            <h1 className='text-green-500  font-bold '>{title} +</h1>
            <div className='flex gap-5 items-start'>
                <p className='text-gray-50 text-lg'>{desc}</p>
            </div>
        </div>
    )

}

const HomeBanner = () => {
    return (
        <div className='w-full bg-gray-950'>
            <CompWrapper>
                <div className='w-full flex justify-between items-center h-auto md:h-[94vh]'>
                    <div className='flex flex-col  md:justify-between h-full py-28 w-full'>
                        <h1 className='text-gray-50 text-5xl mx-4 md:text-6xl font-bold '>Investing <br /> Redefined <span className='text-green-500'><br /> Transparent<br /> Secure<br /> Rewarding</span></h1>
                        <div className='flex gap-8 md:gap-16 text-xl mt-20 mx-4 md:text-4xl items-start justify-start w-full '>
                            <HomeBanItems className='' title={"500"} desc='Money Invested' />
                            <HomeBanItems className='' title={"50%"} desc='Returns' />
                            <HomeBanItems className='' title={"550K"} desc='Startups' />
                        </div>

                    </div>
                    <div className='h-full hidden md:block pt-10 pr-20'>
                        <Image src={"/Homepage/bannermodel4.png"} alt='banner' width={500} height={500} className='h-full w-auto object-cover  ' />
                    </div>

                </div>
                <hr />
            </CompWrapper>
        </div>
    )
}

export default HomeBanner