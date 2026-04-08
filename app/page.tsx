import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='flex justify-between'>
    <div>Home</div>
    <Link href="/login">Login</Link>
    </div>
    <div>page</div>
    </>
  )
}

export default page