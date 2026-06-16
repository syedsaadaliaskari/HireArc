"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

interface Applicant {
  _id: string;
  status: string;
  coverLetter?: string;
  cvPath?: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    skills?: string[];
  };
}

export default function ApplicantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "EMPLOYER") {
      router.push("/auth/login");
      return;
    }

    const fetchApplicants = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/applications/job/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setApplicants(data);
      } catch {
        console.error("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [token, id]);

  const updateStatus = async (applicationId: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );
      const data = await res.json();
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === applicationId ? { ...a, status: data.status } : a,
        ),
      );
      if (selected?._id === applicationId) {
        setSelected((prev) => (prev ? { ...prev, status: data.status } : null));
      }
    } catch {
      console.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 text-sm mt-1">
            {applicants.length} total applications
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {applicants.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
          <p className="text-lg">No applicants yet</p>
          <p className="text-sm mt-1">
            Share your job listing to attract candidates
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div
              key={applicant._id}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                    {applicant.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {applicant.userId?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {applicant.userId?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(applicant.status)}`}
                  >
                    {applicant.status}
                  </span>
                  <button
                    onClick={() => setSelected(applicant)}
                    className="text-sm bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Applicant Details
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {selected.userId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {selected.userId?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {selected.userId?.email}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {selected.userId?.skills && selected.userId.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.userId.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selected.userId?.bio && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Bio
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selected.userId.bio}
                  </p>
                </div>
              )}

              {/* Cover Letter */}
              {selected.coverLetter && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Cover Letter
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4">
                    {selected.coverLetter}
                  </p>
                </div>
              )}

              {/* CV Download */}
              {selected.cvPath && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    CV
                  </p>

                  <a
                    href={`http://localhost:5000/${selected.cvPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download CV
                  </a>
                </div>
              )}

              {/* Status Update */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Update Status
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(selected._id, "ACCEPTED")}
                    disabled={updating || selected.status === "ACCEPTED"}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(selected._id, "REJECTED")}
                    disabled={updating || selected.status === "REJECTED"}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
