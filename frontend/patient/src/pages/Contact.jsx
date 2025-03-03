// import React from 'react'

import { assets } from "../assets/assets"

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 to-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-10 text-sm">
        <img className="w-full md:max-w-[360px]" src={assets.contact_image} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">Our office</p>
          <p className="text-gray-500">50 st, Near Sanaa International Airport <br /> Sanaa, Yemen</p>
          <p className="text-gray-500">
            Tel: (415) 555-0132 <br />
            Email: anasalwardtech@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600">
            Careers at MediPoint
          </p>
          <p className="text-gray-500">Learn more about our teams and jobs openings.</p>
          <button className="border border-black px-8 py-4 text-sm hover:scale-105 hover:bg-primary hover:text-white transition-all duration-300">Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
