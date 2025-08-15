import React from "react";
import assets from "../assets/assets";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();

  const handleStartTracking = () => {
    navigate("/auth/sign-in");
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-center sm:gap-30 p-4 sm:p-0 h-full min-h-[calc(100vh-120px)]">
      <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-5 p-4 sm:p-10 m-4 sm:m-10 text-center sm:text-left">
        <h1 className="font-black gill text-[1.6rem] sm:text-[2.7rem] leading-tight sm:leading-[3.5rem] text-[#193948]">
          Manifesting that
          <br />
          job—with receipts.
        </h1>
        <p className="text-[#193948] text-sm sm:text-base max-w-sm sm:max-w-none">
          Even nanay wants you to keep it organized. No more{" "}
          <br className="hidden sm:block" />
          &lsquo;Where did I apply again?&rsquo; moments.
        </p>
        <button
          onClick={handleStartTracking}
          className="group bg-[#193948] text-white py-4 px-6 sm:py-3 rounded-xl font-semibold mt-2 sm:mt-4 shadow-lg hover:shadow-2xl hover:shadow-[#193948]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 ease-out hover:bg-[#1a3d4d] relative overflow-hidden w-full sm:w-auto"
        >
          <span className="relative z-10 flex items-center justify-center">
            Start tracking
            <ArrowRight
              size={18}
              strokeWidth={2.25}
              className="ml-4 group-hover:translate-x-1 transition-transform duration-300 ease-out"
            />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </button>
      </div>
      <div className="flex-shrink-0 p-4 sm:p-0">
        <img
          className="w-60 sm:w-80 md:w-96 lg:w-[500px] h-auto max-w-full"
          src={assets.illustration}
          alt="Job tracking illustration"
        />
      </div>
    </div>
  );
}

export default Start;
