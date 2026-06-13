"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  skills?: string[];
  status: string;
  postedBy: { name: string; email: string; company?: string };
  createdAt: string;
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch {
        console.error("Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setApplying(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (cv) formData.append("cv", cv);

      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Application failed");
        return;
      }

      setApplied(true);
      setShowForm(false);
    } catch {
      setError("Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!job) return <p className="text-center text-gray-500">Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Job Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {job.title}
            </h1>
            <p className="text-indigo-600 font-medium mb-3">{job.company}</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span>📍 {job.location}</span>
              <span>💼 {job.type}</span>
              {job.salary && <span>💰 {job.salary}</span>}
            </div>
          </div>

          {user?.role === "SEEKER" && job.status === "OPEN" && (
            <div>
              {applied && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your application has been sent successfully. Good luck!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link
                      href="/jobs"
                      className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Browse More Jobs
                    </Link>
                    <Link
                      href="/dashboard"
                      className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                      View My Applications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Submit Application
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Why are you a great fit for this role?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload CV
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCv(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={applying}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Description */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Job Description
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {job.description}
        </p>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
