// import React from 'react'

import { assets } from "../assets/assets"

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
        <div className="flex flex-col md:flex-row gap-12 my-10">
          <img
            className="w-full md:max-w-[360px]"
            src={assets.about_image}
            alt=""
            />
          <div className="flex flex-col justify-start items-start text-sm gap-6 text-gray-600 md:w-2/4">
            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, vel a reprehenderit aliquam animi nisi hic. Aut iure vel quaerat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut blanditiis aperiam, soluta repudiandae natus excepturi amet consectetur facilis incidunt officia. </p>
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi dicta illo fugiat pariatur voluptatum repellat adipisci mollitia architecto nulla esse. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, vel a reprehenderit aliquam animi nisi hic. Aut iure vel quaerat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut blanditiis aperiam, soluta repudiandae natus excepturi amet consectetur facilis incidunt officia. </p>
            <b className="text-gray-800">Our vision</b>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam iste aperiam sint voluptas consequatur minima!
            </p>

      </div>
          </div>
          <div className="text-xl my-4">
            <p>Why <span className="text-gray-700 font-semibold ">choose us?</span></p>
          </div>

          <div className="flex flex-col md:flex-row mb-20">
            <div className="border px-10 md:px-16 py-8 sm:py-16  flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer" >
              <b>Efficiency:</b>
              <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
            </div>

            <div className="border px-10 md:px-16 py-8 sm:py-16  flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer" >
              <b>Convenience:</b>
              <p>Assess to a network of trusted healthcare professionals in your area</p>
            </div>

            <div className="border px-10 md:px-16 py-8 sm:py-16  flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer" >
              <b>Personalization:</b>
              <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
            </div>
          </div>
    </div>
  )
}

export default About
