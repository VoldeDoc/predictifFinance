import "@/styles/ad-slider.css";
import { RiInformation2Line } from "react-icons/ri";

export default function AdSlider() {
  return (
    <>
      <div className="bg-[#0C21C1] p-1">
        <div className="text-white text-nowra flex justify-center items-center gap-3 animate-pulse">
          <RiInformation2Line className="!text-2xl" />{" "}
          <span className="text-sm sm:text-xs">
            Predictif-finance ACN 612 791 803 AFSL 491139. Capital at risk. See
            PDS and TMD. See full disclaimer.
          </span>
        </div>
      </div>
    </>
  );
}
