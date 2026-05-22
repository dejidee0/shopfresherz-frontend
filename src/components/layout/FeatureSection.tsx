"use client";

import { FaArrowRight } from "react-icons/fa";

const features = [
  {
    title: "MacBook Pro",
    desc: "Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage",
    img: "",
    link: "",
    price: 1200000,
  },
  {
    title: "MacBook Air",
    desc: "Apple M1 Chip. 16GB Unified Memory, 256GB SSD Storage",
    img: "",
    link: "",
    price: 900000,
  },
];

const FeatureSection = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-2 md:p-4 lg:p-10 lg:px-60">
      {/* Feature Section */}
      {features.map((feature, index) => (
        <div key={index} className={`flex flex-col-reverse py-10 md:py-5 lg:py-0 md:flex-row gap-6 md:gap-0 p-2 md:p-4 lg:p-10 justify-between items-center rounded-md ${index === 1 ? "bg-[#0D0D0D]": "bg-[#F5F5F5]"}`}>
          <div className="flex flex-col gap-3">
            <p className="flex items-center justify-center p-1 px-2 bg-primary text-white text-xs w-fit rounded-xs">
              INTRODUCING
            </p>
            <p className={`text-2xl font-semibold ${index === 1 && "text-white"}`}>{feature.title}</p>
            <p className={`text-sm w-full lg:w-[50%] ${index === 1 && "text-gray-300"}`}>{feature.desc}</p>
            <a
              href={feature.link}
              className="text-xs w-fit text-white p-2 px-4 rounded-sm bg-primary flex gap-2 items-center justify-center cursor-pointer"
            >
              SHOP NOW
              <FaArrowRight />
            </a>
          </div>
          <div className="relative overflow-visible">
            {feature.img ? (
              <img src={feature.img} alt="banner-image" />
            ) : (
              <div className="p-10 lg:p-16 rounded bg-primary text-white">
                product image
              </div>
            )}

            <div className={`-top-5 -right-5 absolute rounded-full shadow-md shadow-white outline-4 outline-white h-16 w-16 flex items-center justify-center p-4 text-xs text-white ${index === 1 ? "bg-accent": "bg-primary" }`}>
              <p className="font-semibold">₦{feature.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureSection;
