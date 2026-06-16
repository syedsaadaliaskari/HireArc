"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { z } from "zod";

const postJobSchema = z.object({
  title: z
    .string()
    .min(1, "Job title is required")
    .min(3, "Title must be at least 3 characters"),
  company: z.string().min(1, "Company name is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters"),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"], {
    errorMap: () => ({ message: "Select a valid job type" }),
  }),
  location: z.string().min(1, "Location is required"),
  salary: z.string().optional(),
  skills: z.string().optional(),
});

type PostJobForm = z.infer<typeof postJobSchema>;
type FormErrors = Partial<Record<keyof PostJobForm, string>>;

export default function PostJobPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<PostJobForm>({
    title: "",
    company: user?.company || "",
    description: "",
    type: "Full-time",
    location: "",
    salary: "",
    skills: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof PostJobForm]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setFieldErrors({});

    const result = postJobSchema.safeParse(formData);
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof PostJobForm;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    if (!token) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Failed to post job");
        return;
      }

      router.push(`/jobs/${data._id}`);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof PostJobForm) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
      fieldErrors[field]
        ? "border-red-300 focus:ring-red-400 bg-red-50"
        : "border-gray-200 focus:ring-indigo-500 bg-gray-50 focus:bg-white"
    }`;

  const FieldError = ({ field }: { field: keyof PostJobForm }) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clipRule="evenodd"
          />
        </svg>
        {fieldErrors[field]}
      </p>
    ) : null;

  if (user?.role !== "EMPLOYER") {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 max-w-sm">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold mb-1">Access Denied</p>
          <p className="text-gray-400 text-sm">Only employers can post jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-1">
            HireArc
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
          <p className="text-gray-400 text-sm mt-1">
            Fill in the details to attract the right candidates
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 ring-1 ring-red-200">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass("title")}
                placeholder="e.g. Senior React Developer"
              />
              <FieldError field="title" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={inputClass("company")}
                placeholder="Your company name"
              />
              <FieldError field="company" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                <FieldError field="type" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClass("location")}
                  placeholder="e.g. Lahore, Pakistan"
                />
                <FieldError field="location" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={inputClass("salary")}
                placeholder="e.g. PKR 80,000 - 120,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition resize-none ${
                  fieldErrors.description
                    ? "border-red-300 focus:ring-red-400 bg-red-50"
                    : "border-gray-200 focus:ring-indigo-500 bg-gray-50 focus:bg-white"
                }`}
                placeholder="Describe the role, responsibilities and requirements..."
              />
              <FieldError field="description" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills{" "}
                <span className="text-gray-400 font-normal">
                  (comma separated)
                </span>
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className={inputClass("skills")}
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
