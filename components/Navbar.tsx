"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-indigo-600 tracking-tight"
          >
            HireArc
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition"
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                {user.role === "EMPLOYER" && (
                  <Link
                    href="/jobs/post"
                    className="text-sm text-gray-500 hover:text-gray-900 font-medium transition"
                  >
                    Post a Job
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 active:scale-95 font-medium transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link
              href="/jobs"
              className="text-sm text-gray-600 font-medium hover:text-indigo-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Browse Jobs
            </Link>
            {user ? (
              <>
                {user.role === "EMPLOYER" && (
                  <Link
                    href="/jobs/post"
                    className="text-sm text-gray-600 font-medium hover:text-indigo-600 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Post a Job
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 font-medium hover:text-indigo-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-sm text-left text-gray-600 font-medium hover:text-indigo-600 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 font-medium hover:text-indigo-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
