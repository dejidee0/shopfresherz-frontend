import { FaArrowRight } from "react-icons/fa";

const data = {
  title: "MacBook Pro",
  desc: "Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage",
  img: "",
  link: "",
  price: 1200000,
};

const BottomBanner = () => {
  return (
    <div className="p-2 md:p-4 lg:p-10 lg:px-60">
      <div className="flex flex-col-reverse py-10 md:py-0 md:flex-row gap-6 md:gap-0 p-2 md:p-4 lg:p-10 justify-between items-center rounded-sm bg-[#F5F5F5]">
        <div className="flex flex-col gap-3">
          <p className="p-1 px-4 bg-primary text-white text-xs w-fit rounded-sm">
            New Arrival
          </p>
          <p className="text-2xl font-semibold">{data.title}</p>
          <p className="text-sm w-full md:w-[50%]">{data.desc}</p>
          <a
            href={data.link}
            className="text-xs w-fit text-white p-2 px-4 rounded-sm bg-primary flex gap-2 items-center justify-center cursor-pointer"
          >
            SHOP NOW
            <FaArrowRight/>
          </a>
        </div>
        <div className="relative overflow-visible">
          {data.img ? (
            <img src={data.img} alt="banner-image" />
          ) : (
            <div className="p-10 lg:p-20 rounded bg-primary text-white">
              product image
            </div>
          )}

          <div className="-top-5 -left-10 absolute rounded-full shadow-md shadow-white outline-4 outline-white h-16 w-16 flex items-center justify-center p-4 text-xs text-white bg-primary">
            <p className="font-semibold">₦{data.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
