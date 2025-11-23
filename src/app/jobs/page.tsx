'use client'

import { useMemo, useState } from "react"
import { Briefcase, MapPin } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

const jobListings = [
  {
    id: 1,
    title: "Smart Contract Developer",
    company: "Binance APAC",
    type: "Remote",
    location: "Finland",
    posted: "3d",
    salary: "71K – 100K",
    logo: "BNB",
    description:
      "Join a zero-knowledge focused team building trust-mined marketplaces. You own the entire smart contract surface together with infra leads and product strategists.",
    requirements: [
      "4+ years of Solidity/Rust smart-contract experience.",
      "Deep knowledge of audits, threat modelling, and deployment pipelines.",
      "Comfortable collaborating with protocol, design, and compliance teams.",
      "Experience with testnet/mainnet monitoring & analytics tooling.",
    ],
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Coinbase",
    type: "On-site",
    location: "London",
    posted: "2d",
    salary: "80K – 120K",
    logo: "CB",
    description:
      "Design futuristic trading surfaces with privacy-first overlays and motion micro-interactions.",
    requirements: [
      "Expert with Figma, Framer, and motion prototyping.",
      "Solid grasp of responsive systems and component libraries.",
      "Experience shipping crypto/fintech flows is a plus.",
    ],
  },
  {
    id: 3,
    title: "Blockchain Analyst",
    company: "Ethereum Foundation",
    type: "Remote",
    location: "Global",
    posted: "3d",
    salary: "90K – 130K",
    logo: "ETH",
    description:
      "Analyze validator sentiment, staking flows, and produce actionable reports for the foundation.",
    requirements: [
      "Comfortable with on-chain data tooling (Dune, Flipside).",
      "Strong communication and storytelling skills.",
      "Ability to own metrics, dashboards, and alerts.",
    ],
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Ripple",
    type: "Hybrid",
    location: "Singapore",
    posted: "2d",
    salary: "100K – 150K",
    logo: "XRP",
    description:
      "Steer institutional messaging products and orchestrate experiments with ecosystem partners.",
    requirements: [
      "6+ years as PM shipping complex SaaS products.",
      "Crypto or payments exposure preferred.",
      "Data-driven mindset with strong execution rhythm.",
    ],
  },
  {
    id: 5,
    title: "Cybersecurity Specialist",
    company: "Chainalysis",
    type: "Remote",
    location: "United States",
    posted: "2d",
    salary: "95K – 140K",
    logo: "CYB",
    description:
      "Protect sensitive SocialFi credentials and build automated detection playbooks.",
    requirements: [
      "Threat hunting & incident response background.",
      "Understands smart-contract & wallet security posture.",
      "Comfortable coding Python for automation.",
    ],
  },
]

export default function JobsPage() {
  const [selectedId, setSelectedId] = useState(jobListings[0].id)
  const selectedJob = useMemo(
    () => jobListings.find((job) => job.id === selectedId) ?? jobListings[0],
    [selectedId],
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030714]/85 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,163,255,0.35),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(107,77,255,0.25),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%27 height=%27120%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader
          actions={
            <>
              <button className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-[#051431] px-4 py-2 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:flex">
                Jobs
                <Briefcase className="h-4 w-4" />
                <svg
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="rounded-full border border-transparent bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold shadow-[0_15px_45px_rgba(36,122,255,0.45)]">
                Become Pro Member
              </button>
            </>
          }
        />

        <div className="flex flex-col gap-6 lg:flex-row">
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
                        Need A New Talent?
                      </p>
                      <h2 className="text-2xl font-semibold text-white">
                        Find Some Amazing Talent Here
                      </h2>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] px-5 py-2 text-sm font-semibold shadow-[0_10px_30px_rgba(35,119,255,0.45)]">
                      + Post A Job
                    </button>
                  </div>
                </div>

                <section className="rounded-[28px] border border-white/10 bg-[#030b1e]/80 p-6 backdrop-blur">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Recent Jobs
                    </h3>
                    <button className="text-sm font-medium text-[#7BDFFF]">
                      See all
                    </button>
                  </div>
                  <div className="space-y-4">
                    {jobListings.map((job) => {
                      const active = job.id === selectedJob.id
                      return (
                        <button
                          key={job.id}
                          onClick={() => setSelectedId(job.id)}
                          className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition ${
                            active
                              ? "border-[#2E7FFF] bg-[#06183b]/90 shadow-[0_15px_40px_rgba(6,20,43,0.75)]"
                              : "border-transparent bg-[#050f22]/85 hover:border-[#1b2f55]"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-[#031128] text-sm font-semibold text-white">
                              {job.logo}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {job.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {job.company} • {job.type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-xs text-gray-400">
                            <p>{job.posted}</p>
                            <p className="text-white/80">{job.salary}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </section>
              </section>

              <section className="w-full rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 backdrop-blur lg:max-w-sm lg:sticky lg:top-28">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-[#031128] text-sm font-semibold text-white">
                      {selectedJob.logo}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {selectedJob.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {selectedJob.company}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>{selectedJob.posted}</p>
                    <p className="text-white/80">{selectedJob.salary}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 text-[#5FB6FF]" />
                  {selectedJob.type}, {selectedJob.location}
                </div>

                <div className="mt-8 space-y-4 text-sm text-gray-300">
                  <div>
                    <p className="text-base font-semibold text-white">
                      Job Description
                    </p>
                    <p className="mt-2 leading-relaxed text-gray-300">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-white">
                      Job Requirement
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-300">
                      {selectedJob.requirements.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7BDFFF]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button className="mt-8 w-full rounded-full bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] py-3 text-sm font-semibold shadow-[0_15px_45px_rgba(35,119,255,0.45)]">
                  Apply Now
                </button>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
