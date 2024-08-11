"use client";

import React from 'react'

const CompWrapper = ({children}) => {
  return (
    <div className='sm:w-[87%] lg:w-[87%] mx-auto container'>{children}</div>
  )
}

export default CompWrapper