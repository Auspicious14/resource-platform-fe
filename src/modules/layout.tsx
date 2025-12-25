import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fullYear = new Date().getFullYear();
  return (
    <>
      <div>
        <header className="bg-blue-900 text-white sticky top-0 z-50 shadow-md transition-all duration-300">
          <nav className="container mx-auto flex justify-between items-center px-4 py-4">
            <Link
              href="/"
              // className="text-2xl font-bold font-sans hover:text-blue-200 transition-colors duration-200 flex items-center"
            >
              <Image
                src="/devresourcehub logo.jpeg"
                alt="logo"
                width={70}
                height={70}
              />
            </Link>
            <div className="space-x-6 flex items-center">
              <Link
                href="/projects"
                className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
              >
                Projects
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
              >
                Dashboard
              </Link>
              <Link
                href="/paths"
                className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
              >
                Paths
              </Link>
              <Link
                href="/chat"
                className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
              >
                AI Guide
              </Link>
              <Link
                href="/profile"
                className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
              >
                Profile
              </Link>
            </div>
          </nav>
        </header>
      </div>
      {children}
      <footer className="bg-blue-900 text-white py-8 ">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">© {fullYear} Devdrill. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/community/gallery"
              className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
            >
              Gallery
            </Link>
            <Link
              href="/community/leaderboard"
              className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
            >
              Leaderboard
            </Link>
            <a
              href="#"
              className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
