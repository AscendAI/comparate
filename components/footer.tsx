import Link from "next/link";

export const Footer = () => {
  return (
    <footer>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <small className="text-sm font-medium leading-none">
            Developed by
          </small>
          <Link href="https://gaido.nl" target="_blank">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold underline">
              Gaido
            </code>
          </Link>
        </div>
      </div>
    </footer>
  );
};
