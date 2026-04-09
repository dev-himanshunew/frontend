import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='flex justify-around mt-5'>
    <div>Home</div>
    <Link href="/login">Login</Link>
    </div>
    <div className='flex justify-center mt-5 py-40 border-4 border-white '>info</div>
    </>
  )
}

export default page