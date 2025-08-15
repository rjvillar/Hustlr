import React from "react";

function FormButton({ children }) {
  return (
    <button
      type="submit"
      className="group w-full bg-[#193948] hover:bg-[#193948] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:shadow-[#193948]/25 relative overflow-hidden mt-2"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
    </button>
  );
}

export default FormButton;
