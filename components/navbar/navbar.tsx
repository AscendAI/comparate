import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { BusIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
export const NavBar: FC = () => {
  return (
    <>
      <div className="animate-in fade-in w-full">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                {/* <BusIcon className="w-8 h-8 mr-2 inline" />{" "}
                <span className="text-xl font-semibold tracking-tighter text-slate-800 mr-6">
                  Helder Transport
                </span> */}
                <Image src='/helder_logo.jpg' alt='logo'  height={200} width={200}/>
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow">
              <NavbarUserLinks />
            </div>
            <div className="grow md:hidden flex justify-end">
              <NavbarMobile />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
