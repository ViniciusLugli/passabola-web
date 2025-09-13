"use client";
import Image from "next/image";

export default function SearchBar() {
  return (
    <div className="flex items-center gap-4">
      <div
        className="
            relative 
            flex-grow
          "
      >
        <input
          type="text"
          placeholder="Pesquise os jogos"
          className="
                w-full 
                py-4 
                px-6 
                rounded-full 
                border 
                border-gray-300 
                bg-white 
                focus:outline-none 
                focus:border-purple-500
              "
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          <Image src="/icons/lupa.svg" alt="lupa" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
