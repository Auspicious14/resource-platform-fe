"use client";

import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationProvider } from "./notifications/NotificationContext";
import { NotificationBell } from "./notifications/NotificationBell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnboardingModal } from "./onboarding/OnboardingModal";
import { GlobalSearch } from "@/components/Search/GlobalSearch";

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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (!onboardingCompleted) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 2000); // Show after 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem("onboardingCompleted", "true");
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NotificationProvider>
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
          <header className="bg-blue-900 dark:bg-gray-900 text-white sticky top-0 z-50 shadow-md transition-all duration-300 border-b dark:border-gray-800">
            <nav className="container mx-auto flex justify-between items-center px-4 py-4">
              <Link href="/">
                <Image
                  src="/devresourcehub logo.jpeg"
                  alt="logo"
                  width={70}
                  height={70}
                  className="rounded-lg"
                />
              </Link>
              <div className="flex-1 max-w-md mx-8 hidden lg:block">
                <GlobalSearch />
              </div>
              <div className="hidden md:flex space-x-6 items-center">
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
                <NotificationBell />
                <ThemeToggle />
              </div>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-4">
                <ThemeToggle />
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white hover:bg-blue-800 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden bg-blue-900 border-t border-blue-800 overflow-hidden"
                >
                  <div className="flex flex-col p-4 space-y-4">
                    <div className="px-2 pb-2">
                      <GlobalSearch />
                    </div>
                    <Link
                      href="/projects"
                      className="px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Projects
                    </Link>
                    <Link
                      href="/dashboard"
                      className="px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/paths"
                      className="px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Paths
                    </Link>
                    <Link
                      href="/chat"
                      className="px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      AI Guide
                    </Link>
                    <Link
                      href="/profile"
                      className="px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="font-medium">Notifications</span>
                      <NotificationBell />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>
          {children}
          <footer className="bg-blue-900 dark:bg-gray-900 text-white py-8 border-t dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="mb-4">
                © {fullYear} Devdrill. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                <Link
                  href="/projects"
                  className="hover:text-blue-600 transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/paths"
                  className="hover:text-blue-600 transition-colors"
                >
                  Paths
                </Link>
                <Link
                  href="/community"
                  className="hover:text-blue-600 transition-colors"
                >
                  Community
                </Link>
                <Link
                  href="/about"
                  className="hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
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
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="hover:text-blue-200 transition-colors duration-200 font-medium hover:underline underline-offset-4"
                >
                  Onboarding
                </button>
              </div>
            </div>
          </footer>
        </div>
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={handleCloseOnboarding}
        />
      </NotificationProvider>
    </ThemeProvider>
  );
}
