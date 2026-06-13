import Link from "next/link";

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Browse Jobs",
    desc: "Search thousands of curated opportunities across every industry and role type.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
    title: "Easy Apply",
    desc: "Upload your CV once and apply to any role in a single click — no repeated forms.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
      </svg>
    ),
    title: "Top Companies",
    desc: "Get discovered by the best employers actively hiring for roles that match your skills.",
  },
];

const stats = [
  { value: "10,000+", label: "Active Jobs" },
  { value: "3,500+", label: "Companies" },
  { value: "50,000+", label: "Job Seekers" },
  { value: "95%", label: "Placement Rate" },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    desc: "Sign up as a job seeker or employer in under a minute.",
  },
  {
    step: "02",
    title: "Build Your Profile",
    desc: "Add your skills, experience, and upload your CV.",
  },
  {
    step: "03",
    title: "Apply or Post",
    desc: "Apply to jobs or post openings and find the right talent.",
  },
  {
    step: "04",
    title: "Get Hired",
    desc: "Connect with employers and land your next opportunity.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            HireArc — Find Work That Matters
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Find Your{" "}
            <span className="text-indigo-600 relative">
              Dream Job
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-200 rounded-full" />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Connect with top employers and land the role you deserve. Thousands
            of opportunities — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-7 py-3 rounded-lg font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
            >
              Browse Jobs
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-7 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              Post a Job
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              No spam
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Verified employers
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {s.value}
                </p>
                <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-2">
            Why HireArc
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Everything you need to land your next role
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-transparent hover:border-indigo-100 transition-all duration-200 group"
            >
              <div className="w-11 h-11 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-2">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Get hired in 4 simple steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-full h-px bg-indigo-100" />
                )}
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 relative z-10">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-indigo-600 rounded-2xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-30" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full opacity-30" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to take the next step?
            </h2>
            <p className="text-indigo-200 text-sm mb-7 max-w-md mx-auto">
              Join thousands of professionals who found their next opportunity
              through HireArc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-semibold text-sm px-7 py-3 rounded-lg hover:bg-indigo-50 active:scale-95 transition-all"
              >
                Explore Openings
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-indigo-700 text-white font-semibold text-sm px-7 py-3 rounded-lg hover:bg-indigo-800 active:scale-95 transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
