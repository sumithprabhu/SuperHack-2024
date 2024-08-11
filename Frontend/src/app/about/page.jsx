import React from 'react'
import Image from 'next/image';
import { FaCoins } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { FaGlobeAmericas } from "react-icons/fa";
const page = () => {
  const data = [
    {
      image: `/recomendation_images/c_one.webp`,
      name: `WiGL`,
      review: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    },
    {
      image: `/recomendation_images/c_two.webp`,
      name: `NERD Focus`,
      review: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    },
    {
      image: `/recomendation_images/c_three.webp`,
      name: `ACME AtronOmatic`,
      review: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    },

  ];
  return (
    <div className="w-full bg-gray-50 min-h-[87%]">
      <section class="overflow-hidden bg-white pb-12 pt-4">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div class="lg:pr-8 lg:pt-4">
              <div class="lg:max-w-lg">
                <h2 class="text-base font-semibold leading-7 text-indigo-600">Our Motive</h2>
                <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">A Better Investment Platform</p>
                <p class="mt-6 text-lg leading-8 text-gray-600">We've built a Blockchain-powered investment platform, which is better in various aspects when compared to traditional stock markets.
                </p>
                <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  <div class="relative pl-9">
                    <dt class="inline font-semibold text-gray-900">
                      <FaCoins className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />Currency Independent:
                    </dt>
                    <dd class="inline"> RaiseCoin works on Ether(ETH), which is a global cryptocurrency. We've solved the currency-conversion problem in style!
                    </dd>
                  </div>
                  <div class="relative pl-9">
                    <dt class="inline font-semibold text-gray-900">
                      <MdSecurity className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                      Secure:
                    </dt>
                    <dd class="inline"> Our platform leverages the security of transactions using Web 3.0 approach. All transactions are tansparent.</dd>
                  </div>
                  <div class="relative pl-9">
                    <dt class="inline font-semibold text-gray-900">
                      <FaGlobeAmericas className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />Global: </dt>
                    <dd class="inline"> RaiseCoin is a global platform that eliminated geographical restrictions will investing and gathering funds.
                    </dd>
                  </div>
                </dl>
              </div>
              <div class="mt-10 flex items-center gap-x-6">
                <a href="/explore"
                  class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start Investing now!
                </a>
                {/* <a href="#" class="text-sm font-semibold leading-6 text-gray-700">Schedule a demo
            <span aria-hidden="true">→</span>
          </a> */}
              </div>
            </div>
            <Image src={"/aboutus3.jpg"} alt='banner' width={500} height={500} className='h-full md:block hidden w-auto' />
          </div>
        </div>
      </section>
    </div>
  )
}

export default page