"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: string;
  createdAt: string;
}

interface Applicant {
  _id: string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    skills?: string[];
  };
}

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    status: string;
  };
}

const STATUS_STYLES: Record<string, string> = {
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-1 ring-red-200",
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  OPEN: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  CLOSED: "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Employer — expanded job to show applicants
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Record<string, Applicant[]>>({});
  const [applicantsLoading, setApplicantsLoading] = useState<string | null>(
    null,
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login");
  }, [user, isLoading]);

  useEffect(() => {
    if (!token || !user) return;
    const fetchData = async () => {
      try {
        if (user.role === "EMPLOYER") {
          const res = await fetch("http://localhost:5000/api/jobs/my-jobs", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobs(await res.json());
        } else {
          const res = await fetch("http://localhost:5000/api/applications/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplications(await res.json());
        }
      } catch {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user]);

  const loadApplicants = async (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    setExpandedJobId(jobId);
    if (applicants[jobId]) return; // already loaded
    setApplicantsLoading(jobId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setApplicants((prev) => ({ ...prev, [jobId]: data }));
    } catch {
      console.error("Failed to fetch applicants");
    } finally {
      setApplicantsLoading(null);
    }
  };

  const updateStatus = async (
    applicationId: string,
    jobId: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    setUpdatingId(applicationId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );
      if (res.ok) {
        setApplicants((prev) => ({
          ...prev,
          [jobId]: prev[jobId].map((a) =>
            a._id === applicationId ? { ...a, status } : a,
          ),
        }));
      }
    } catch {
      console.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Loading Skeleton ────────────────────────────────────────
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
            >
              <div className="h-5 w-48 bg-gray-100 rounded mb-3" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-1">
                HireArc — Dashboard
              </p>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name} 👋
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {user?.role === "EMPLOYER"
                  ? "Manage your listings and review applicants"
                  : "Track all your job applications in one place"}
              </p>
            </div>
            {user?.role === "EMPLOYER" && (
              <Link
                href="/jobs/post"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
              >
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Post New Job
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user?.role === "EMPLOYER" ? (
            <>
              {[
                {
                  label: "Total Jobs",
                  value: jobs.length,
                  color: "text-indigo-600",
                },
                {
                  label: "Active",
                  value: jobs.filter((j) => j.status === "OPEN").length,
                  color: "text-emerald-600",
                },
                {
                  label: "Closed",
                  value: jobs.filter((j) => j.status === "CLOSED").length,
                  color: "text-gray-500",
                },
                {
                  label: "Applicants",
                  value: Object.values(applicants).flat().length,
                  color: "text-blue-600",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-xl p-5 shadow-sm text-center border border-transparent hover:border-indigo-100 transition"
                >
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                {
                  label: "Applied",
                  value: applications.length,
                  color: "text-indigo-600",
                },
                {
                  label: "Pending",
                  value: applications.filter((a) => a.status === "PENDING")
                    .length,
                  color: "text-amber-600",
                },
                {
                  label: "Accepted",
                  value: applications.filter((a) => a.status === "ACCEPTED")
                    .length,
                  color: "text-emerald-600",
                },
                {
                  label: "Rejected",
                  value: applications.filter((a) => a.status === "REJECTED")
                    .length,
                  color: "text-red-500",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-xl p-5 shadow-sm text-center border border-transparent hover:border-indigo-100 transition"
                >
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── EMPLOYER VIEW ───────────────────────────────────── */}
        {user?.role === "EMPLOYER" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Your Job Listings
              </h2>
            </div>

            {jobs.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006-3.75 3.75m0 0-3.75-3.75m3.75 3.75V10.5"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium mb-1">
                  No jobs posted yet
                </p>
                <Link
                  href="/jobs/post"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Post your first job →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <div key={job._id}>
                    {/* Job Row */}
                    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-base border border-indigo-100 shrink-0">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-0.5">
                            <span>{job.company}</span>
                            <span>·</span>
                            <span>{job.location}</span>
                            <span>·</span>
                            <span>{job.type}</span>
                            <span>·</span>
                            <span>{timeAgo(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[job.status]}`}
                        >
                          {job.status}
                        </span>
                        <button
                          onClick={() => loadApplicants(job._id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                        >
                          {applicantsLoading === job._id ? (
                            <span>Loading...</span>
                          ) : (
                            <>
                              Applicants
                              <svg
                                className={`w-3.5 h-3.5 transition-transform ${expandedJobId === job._id ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                        <Link
                          href={`/jobs/${job._id}`}
                          className="text-xs text-gray-400 hover:text-gray-700 font-medium transition"
                        >
                          View
                        </Link>
                      </div>
                    </div>

                    {/* Applicants Drawer */}
                    {expandedJobId === job._id && (
                      <div className="bg-[#F7F8FC] border-t border-gray-100 px-6 py-4">
                        {!applicants[job._id] ? (
                          <p className="text-sm text-gray-400 text-center py-4">
                            Loading applicants...
                          </p>
                        ) : applicants[job._id].length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-4">
                            No applicants yet for this role.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                              {applicants[job._id].length} Applicant
                              {applicants[job._id].length !== 1 ? "s" : ""}
                            </p>
                            {applicants[job._id].map((applicant) => (
                              <div
                                key={applicant._id}
                                className="bg-white rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-100"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                                    {applicant.userId.name
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {applicant.userId.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {applicant.userId.email}
                                    </p>
                                    {applicant.userId.skills &&
                                      applicant.userId.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                          {applicant.userId.skills
                                            .slice(0, 4)
                                            .map((skill) => (
                                              <span
                                                key={skill}
                                                className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md ring-1 ring-gray-200"
                                              >
                                                {skill}
                                              </span>
                                            ))}
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[applicant.status]}`}
                                  >
                                    {applicant.status}
                                  </span>
                                  {applicant.status === "PENDING" && (
                                    <>
                                      <button
                                        disabled={updatingId === applicant._id}
                                        onClick={() =>
                                          updateStatus(
                                            applicant._id,
                                            job._id,
                                            "ACCEPTED",
                                          )
                                        }
                                        className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        disabled={updatingId === applicant._id}
                                        onClick={() =>
                                          updateStatus(
                                            applicant._id,
                                            job._id,
                                            "REJECTED",
                                          )
                                        }
                                        className="text-xs font-semibold bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SEEKER VIEW ─────────────────────────────────────── */}
        {user?.role !== "EMPLOYER" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Your Applications
              </h2>
            </div>

            {applications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium mb-1">
                  No applications yet
                </p>
                <Link
                  href="/jobs"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Browse jobs →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-base border border-indigo-100 shrink-0">
                        {app.jobId?.company?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {app.jobId?.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-0.5">
                          <span>{app.jobId?.company}</span>
                          <span>·</span>
                          <span>{app.jobId?.location}</span>
                          <span>·</span>
                          <span>{app.jobId?.type}</span>
                          <span>·</span>
                          <span>{timeAgo(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[app.status]}`}
                      >
                        {app.status}
                      </span>
                      <Link
                        href={`/jobs/${app.jobId?._id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                      >
                        View Job
                        <svg
                          className="w-3 h-3"
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
