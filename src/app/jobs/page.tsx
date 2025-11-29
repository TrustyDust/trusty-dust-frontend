'use client'

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Briefcase, Loader2, MapPin, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { NavLink } from "@/components/NavLink"
import { ApplyJobModal } from "@/components/dashboard/ApplyJobModal"
import { Textarea } from "@/components/ui/textarea"
import { useSearchJobsApi, useCreateJobApi } from "@/hooks/api/jobs"
import type { JobSearchItem } from "@/types/api"
import { formatTimeAgo } from "@/lib/format-time"
import { getErrorMessage } from "@/lib/get-error-message"

const DEFAULT_JOB_LIMIT = 8

type JobFormState = {
  title: string
  companyName: string
  location: string
  jobType: string
  reward: string
  minTrustScore: string
  description: string
  requirements: string[]
  salaryMin: string
  salaryMax: string
  closeAt: string
  logoFile: File | null
}

const JOB_FORM_DEFAULT: JobFormState = {
  title: "",
  companyName: "",
  location: "",
  jobType: "",
  reward: "",
  minTrustScore: "",
  description: "",
  requirements: [""],
  salaryMin: "",
  salaryMax: "",
  closeAt: "",
  logoFile: null,
}

export default function JobsPage() {
  const [filters, setFilters] = useState<{ keyword?: string; jobType?: string; limit?: number }>({
    limit: DEFAULT_JOB_LIMIT,
  })
  const [keywordInput, setKeywordInput] = useState("")
  const [jobTypeInput, setJobTypeInput] = useState("")
  const searchJobs = useSearchJobsApi(filters)
  const jobs = searchJobs.data?.data ?? []

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const selectedJob = useMemo<JobSearchItem | null>(() => {
    if (jobs.length === 0) {
      return null
    }
    return jobs.find((job) => job.id === selectedJobId) ?? jobs[0]
  }, [jobs, selectedJobId])

  useEffect(() => {
    if (jobs.length === 0) {
      setSelectedJobId(null)
      return
    }
    if (!selectedJobId || !jobs.some((job) => job.id === selectedJobId)) {
      setSelectedJobId(jobs[0].id)
    }
  }, [jobs, selectedJobId])

  const [jobForm, setJobForm] = useState<JobFormState>(JOB_FORM_DEFAULT)
  const [jobFormError, setJobFormError] = useState<string | null>(null)
  const [logoInputKey, setLogoInputKey] = useState(0)
  const createJob = useCreateJobApi()

  const isSearching = searchJobs.isLoading || searchJobs.isFetching

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFilters((prev) => ({
      ...prev,
      keyword: keywordInput.trim() || undefined,
      jobType: jobTypeInput.trim() || undefined,
      limit: prev.limit ?? DEFAULT_JOB_LIMIT,
    }))
  }

  const handleResetFilters = () => {
    setKeywordInput("")
    setJobTypeInput("")
    setFilters({ limit: DEFAULT_JOB_LIMIT })
  }

  const updateJobForm = (field: keyof JobFormState, value: string | File | null) => {
    setJobForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setJobForm((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, idx) => (idx === index ? value : req)),
    }))
  }

  const addRequirement = () => {
    setJobForm((prev) => ({ ...prev, requirements: [...prev.requirements, ""] }))
  }

  const removeRequirement = (index: number) => {
    setJobForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, idx) => idx !== index),
    }))
  }

  const resetJobForm = () => {
    setJobForm(JOB_FORM_DEFAULT)
    setJobFormError(null)
    setLogoInputKey((prev) => prev + 1)
  }

  const handlePostJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setJobFormError(null)
    if (
      !jobForm.title.trim() ||
      !jobForm.companyName.trim() ||
      !jobForm.location.trim() ||
      !jobForm.jobType.trim() ||
      !jobForm.reward ||
      !jobForm.minTrustScore ||
      !jobForm.description.trim()
    ) {
      setJobFormError("Please fill all required fields.")
      return
    }

    const formData = new FormData()
    formData.append("title", jobForm.title.trim())
    formData.append("companyName", jobForm.companyName.trim())
    formData.append("location", jobForm.location.trim())
    formData.append("jobType", jobForm.jobType.trim())
    formData.append("description", jobForm.description.trim())
    formData.append("reward", jobForm.reward)
    formData.append("minTrustScore", jobForm.minTrustScore)

    jobForm.requirements
      .map((req) => req.trim())
      .filter(Boolean)
      .forEach((req) => formData.append("requirements", req))

    if (jobForm.salaryMin) {
      formData.append("salaryMin", jobForm.salaryMin)
    }
    if (jobForm.salaryMax) {
      formData.append("salaryMax", jobForm.salaryMax)
    }
    if (jobForm.closeAt) {
      try {
        const iso = new Date(jobForm.closeAt).toISOString()
        formData.append("closeAt", iso)
      } catch (error) {
        setJobFormError("Invalid closing date.")
        return
      }
    }
    if (jobForm.logoFile) {
      formData.append("companyLogo", jobForm.logoFile)
    }

    try {
      await createJob.mutateAsync(formData)
      toast.success("Job posted successfully")
      resetJobForm()
      await searchJobs.refetch()
    } catch (error) {
      setJobFormError(getErrorMessage(error))
    }
  }

  const openApplyModal = () => {
    if (!selectedJob) {
      toast.info("Select a job to apply")
      return
    }
    setIsApplyModalOpen(true)
  }

  return (
    <div className="relative min-h-screen px-4 pb-10 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-linear-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.35),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(107,77,255,0.25),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%27 height=%27120%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader
          actions={
            <NavLink
              href="#post-job"
              className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-[#051431] px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:inline-flex"
            >
              <Briefcase className="h-4 w-4" />
              Post a job
            </NavLink>
          }
        />

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
            <DashboardSidebar activeNav="jobs" />
          </aside>

          <main className="flex-1">
            <div className="flex flex-col gap-6 lg:flex-row">
              <section className="flex-1 space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 backdrop-blur">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[#74b8ff]">
                        Need new talent?
                      </p>
                      <h2 className="text-2xl font-semibold text-white">
                        Discover trusted builders and contributors
                      </h2>
                    </div>
                    <NavLink
                      href="#post-job"
                      className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold shadow-[0_10px_30px_rgba(35,119,255,0.45)]"
                    >
                      + Post a job
                    </NavLink>
                  </div>
                </div>

                <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/80 p-6 backdrop-blur">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">Open roles</h3>
                    <button
                      type="button"
                      onClick={() => searchJobs.refetch()}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-gray-200 transition hover:bg-white/10"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${searchJobs.isFetching ? "animate-spin" : ""}`} />
                      Refresh
                    </button>
                  </div>

                  <form className="mb-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSearchSubmit}>
                    <div className="flex-1">
                      <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Keyword</label>
                      <div className="relative mt-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                          value={keywordInput}
                          onChange={(event) => setKeywordInput(event.target.value)}
                          placeholder="Search title, company, stack..."
                          className="w-full rounded-2xl border border-white/10 bg-[#050f22] py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Job Type</label>
                      <input
                        value={jobTypeInput}
                        onChange={(event) => setJobTypeInput(event.target.value)}
                        placeholder="Remote, On-site, Contract..."
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        className="rounded-2xl bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold shadow-[0_10px_30px_rgba(35,119,255,0.45)]"
                      >
                        Search
                      </button>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
                      >
                        Reset
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {isSearching && (
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={`job-skeleton-${item}`}
                            className="h-20 rounded-3xl border border-white/5 bg-[#050f22]/70 animate-pulse"
                          />
                        ))}
                      </div>
                    )}

                    {!isSearching && searchJobs.isError && (
                      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                        <p>{getErrorMessage(searchJobs.error)}</p>
                      </div>
                    )}

                    {!isSearching && !searchJobs.isError && jobs.length === 0 && (
                      <div className="rounded-3xl border border-white/10 bg-[#050f22]/80 p-6 text-center text-sm text-gray-400">
                        No jobs match your filters. Try adjusting the search keyword or job type.
                      </div>
                    )}

                    {!isSearching &&
                      !searchJobs.isError &&
                      jobs.map((job) => {
                        const active = selectedJob?.id === job.id
                        return (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() => setSelectedJobId(job.id)}
                            className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left transition ${
                              active
                                ? "border-[#2E7FFF] bg-[#06183b]/90 shadow-[0_15px_40px_rgba(6,20,43,0.75)]"
                                : "border-white/5 bg-[#050f22]/85 hover:border-[#1b2f55]"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-[#031128] text-sm font-semibold text-white">
                                {job.companyName
                                  .split(" ")
                                  .map((word) => word[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">{job.title}</p>
                                <p className="text-xs text-gray-400">
                                  {job.companyName} • {job.jobType}
                                </p>
                              </div>
                            </div>
                            <div className="text-right text-xs text-gray-400">
                              <p>{formatTimeAgo(job.createdAt)}</p>
                              <p className="text-white/80">{job.reward.toLocaleString()} DUST</p>
                            </div>
                          </button>
                        )
                      })}
                  </div>
                </section>

                <section
                  id="post-job"
                  className="rounded-[28px] border border-white/10 bg-[#040f25]/85 p-6 backdrop-blur"
                >
                  <h3 className="text-lg font-semibold text-white">Post a new job</h3>
                  <p className="text-xs text-gray-400">
                    Burn DUST and lock escrow automatically when creating a job. Fill in the details
                    below.
                  </p>
                  <form className="mt-5 space-y-4" onSubmit={handlePostJob}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Title *
                        </label>
                        <input
                          value={jobForm.title}
                          onChange={(event) => updateJobForm("title", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="Senior Product Manager"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Company *
                        </label>
                        <input
                          value={jobForm.companyName}
                          onChange={(event) => updateJobForm("companyName", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="Trusty Dust Labs"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Location *
                        </label>
                        <input
                          value={jobForm.location}
                          onChange={(event) => updateJobForm("location", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="Remote"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Job Type *
                        </label>
                        <input
                          value={jobForm.jobType}
                          onChange={(event) => updateJobForm("jobType", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="Remote / Contract"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Reward (DUST) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={jobForm.reward}
                          onChange={(event) => updateJobForm("reward", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Min Trust Score *
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={jobForm.minTrustScore}
                          onChange={(event) => updateJobForm("minTrustScore", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Description *
                      </label>
                      <Textarea
                        value={jobForm.description}
                        onChange={(event) => updateJobForm("description", event.target.value)}
                        placeholder="Share the scope, responsibilities, and what success looks like."
                        className="mt-1 min-h-[140px] rounded-2xl border border-white/10 bg-[#050f22] text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus-visible:ring-[#2E7FFF]"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Requirements
                      </label>
                      <div className="mt-2 space-y-3">
                        {jobForm.requirements.map((req, idx) => (
                          <div key={`requirement-${idx}`} className="flex gap-2">
                            <input
                              value={req}
                              onChange={(event) => updateRequirement(idx, event.target.value)}
                              placeholder="e.g. 5+ years TypeScript"
                              className="flex-1 rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                            />
                            {jobForm.requirements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRequirement(idx)}
                                className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addRequirement}
                          className="w-full rounded-2xl border border-dashed border-white/20 px-4 py-2 text-sm text-gray-300 transition hover:border-[#2E7FFF] hover:bg-[#2E7FFF]/5 hover:text-white"
                        >
                          + Add requirement
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Salary Min
                        </label>
                        <input
                          type="number"
                          value={jobForm.salaryMin}
                          onChange={(event) => updateJobForm("salaryMin", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Salary Max
                        </label>
                        <input
                          type="number"
                          value={jobForm.salaryMax}
                          onChange={(event) => updateJobForm("salaryMax", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Closing Date
                        </label>
                        <input
                          type="datetime-local"
                          value={jobForm.closeAt}
                          onChange={(event) => updateJobForm("closeAt", event.target.value)}
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-[#050f22] px-4 py-2 text-sm text-white focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Company Logo
                      </label>
                      <input
                        key={logoInputKey}
                        type="file"
                        accept="image/*"
                        onChange={(event) => updateJobForm("logoFile", event.target.files?.[0] ?? null)}
                        className="mt-1 w-full rounded-2xl border border-dashed border-white/15 bg-[#050f22]/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-[#2E7FFF]/20 file:px-4 file:py-1 file:text-sm file:text-[#7BDFFF] focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
                      />
                    </div>

                    {jobFormError && (
                      <p className="text-xs font-semibold text-red-400">{jobFormError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={createJob.isPending}
                      className="w-full rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] py-3 text-sm font-semibold shadow-[0_15px_45px_rgba(35,119,255,0.45)] transition hover:shadow-[0_20px_60px_rgba(35,119,255,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {createJob.isPending ? "Posting job..." : "Post job"}
                    </button>
                  </form>
                </section>
              </section>

              <section className="w-full rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur lg:sticky lg:top-28 lg:max-w-sm">
                {selectedJob ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">{selectedJob.companyName}</p>
                        <p className="text-lg font-semibold text-white">{selectedJob.title}</p>
                        <p className="text-xs text-gray-500">
                          Posted {formatTimeAgo(selectedJob.createdAt)}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <p>{selectedJob.jobType}</p>
                        <p className="text-white/80">{selectedJob.reward.toLocaleString()} DUST</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#5FB6FF]" />
                        {selectedJob.location}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Min trust</span>
                        <span className="font-semibold text-white">
                          {selectedJob.minTrustScore ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Applicants</span>
                        <span className="font-semibold text-white">
                          {selectedJob.applications ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4 text-sm text-gray-300">
                      <div>
                        <p className="text-base font-semibold text-white">Description</p>
                        <p className="mt-2 leading-relaxed text-gray-300">{selectedJob.description}</p>
                      </div>
                      {selectedJob.requirements?.length ? (
                        <div>
                          <p className="text-base font-semibold text-white">Requirements</p>
                          <ul className="mt-3 space-y-2 text-sm text-gray-300">
                            {selectedJob.requirements.map((req) => (
                              <li key={req} className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7BDFFF]" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    <button
                      onClick={openApplyModal}
                      className="mt-8 w-full rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] py-3 text-sm font-semibold shadow-[0_15px_45px_rgba(35,119,255,0.45)] transition hover:shadow-[0_20px_60px_rgba(35,119,255,0.6)]"
                    >
                      Apply now
                    </button>
                  </>
                ) : (
                  <div className="text-center text-sm text-gray-400">
                    No jobs available yet. Post a job or adjust your filters.
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={selectedJob?.id}
        jobTitle={selectedJob?.title}
      />
    </div>
  )
}

