import React from 'react'
import Nav from '../component/Nav'
import home from "../assets/home1.jpg"
function Home() {
  return (
    <div className="w-[100%] overflow-hidden">
      <div className='w=[100%] lg:h-[140vh] h-[70vh] relative'>
        <Nav/>
        <img src={home} className='object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh]' alt="" />
      </div>
      </div>
  )
}

export default Home