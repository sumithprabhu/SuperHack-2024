import React from 'react'
import CompWrapper from '../Utils/CompWrapper'

const Steps = () => {
    return (
        <div className='w-full bg-gray-00'>
            <div className='w-4/5 mx-auto py-28'>
                <h2 className='text-gray-700 tracking-widest text-4xl font-medium uppercase'>How To Invest </h2>
                <div className='grid grid-cols-1  md:grid-cols-3 text-gray-700 mt-5 gap-10'>
                    <div className='w-full flex flex-col items-start bg-green-50 py-4 px-6 rounded-xl border border-green-300'>
                        <span className='uppercase tracking-widest leading-tight text-green-500 text-xl font-semibold mb-2'>1.<br />Sign<br /> Up</span>
                        <p className='text-gray-500 leading-tight font-medium'>Securely create an account on RaiseCoin</p>
                    </div>
                    <div className='w-full flex flex-col items-start bg-green-50 py-4 px-6 rounded-xl border border-green-300'>
                        <span className='uppercase tracking-widest leading-tight text-green-500 text-xl font-semibold mb-2'>2.<br />Browse<br /> Investment</span>
                        <p className='text-gray-500 leading-tight font-medium'>Review hundreds of investment opportunities, from Startups.</p>
                    </div>
                    <div className='w-full flex flex-col items-start bg-green-50 py-4 px-6 rounded-xl border border-green-300'>
                        <span className='uppercase tracking-widest leading-tight text-green-500 text-xl font-semibold mb-2'>3.<br />Make An<br /> Investment</span>
                        <p className='text-gray-500 leading-tight font-medium'>Submit your payment and own a financial stake in a Startup.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Steps