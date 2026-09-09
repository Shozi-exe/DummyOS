import { ArrowLeft, ArrowRight } from "lucide-react";
import { RxHamburgerMenu, RxReload } from "react-icons/rx";

const Browser = () => {
  return (
    <div className="h-full w-full bg-[#272626] text-white flex flex-col">
      <header className="flex w-full p-3 bg-[#333131]">
        <nav className="flex justify-between w-full text-gray-300 items-center">
          <div className="flex items-center gap-3">
            <ArrowLeft size={20} />
            <ArrowRight size={20} />
            <RxReload size={15} className="stroke-[0.5]" />
          </div>
          <p className="bg-[#1e1e1e] w-[80%] px-4 py-1.5 mx-4 rounded-lg text-sm">shozi.me</p>
          <RxHamburgerMenu size={20} />
        </nav>
      </header>
      <iframe className="h-full w-full border-none flex-1" src="https://shozi.me" title="Browser View" />
    </div>
  );
};

export default Browser;
