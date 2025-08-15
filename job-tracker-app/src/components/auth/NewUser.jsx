import React from "react";
import assets from "../../assets/assets";

function NewUser() {
  return (
    <>
      <div className="relative">
        <img
          className="w-48 sm:w-56 md:w-64 h-auto mx-auto sm:mx-0 mb-2 drop-shadow-lg"
          src={assets.illustration2}
          alt=""
        />
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#FCDC73] rounded-full opacity-20 blur-sm"></div>
      </div>
      <h1 className="font-black gill text-[1.8rem] sm:text-[2.2rem] md:text-[2.5rem] leading-tight text-[#193948] tracking-tight">
        Create an account.
      </h1>
      <p className="text-[#193948]/80 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm font-medium mt-1">
        Let&rsquo;s turn job-hunting chaos into organized anxiety.
      </p>
    </>
  );
}

export default NewUser;
