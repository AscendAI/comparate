import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import { Toggle } from "../ui/toggle";
export const NavBar: FC = () => {
  return (
    <>
      <div className="animate-in fade-in w-full">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                <Image
                  src="/helder_logo.jpg"
                  alt="logo"
                  height={200}
                  width={200}
                />
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow"></div>
            <Toggle aria-label="Toggle bold" variant="outline">
              Toggle English/Dutch
            </Toggle>
          </div>
        </nav>
      </div>
    </>
  );
};
