'use client'

import { useState } from "react"
import Link from "next/link"
import {
    Briefcase,
    UploadCloud,
    Plus,
    ChevronDown,
    ShieldCheck
} from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

export default function CreateJobPage() {
    // State untuk dynamic requirements
    const [requirements, setRequirements] = useState<string[]>([""])

    // Handler untuk menambah field requirement
    const addRequirement = () => {
        setRequirements([...requirements, ""])
    }

    // Handler untuk update value requirement
    const updateRequirement = (index: number, value: string) => {
        const newReqs = [...requirements]
        newReqs[index] = value
        setRequirements(newReqs)
    }

    // Reusable styling classes biar kodingan rapi
    const labelClass = "text-sm font-medium text-gray-300 md:w-40 shrink-0"
    const inputContainerClass = "flex flex-col md:flex-row md:items-start gap-2 md:gap-4 w-full"
    const inputClass = "w-full rounded-xl border border-white/10 bg-[#0A1325] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF] transition-all"

    return (
        <div className="relative min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8 pb-10">
            {/* Background Effects (Sama persis dengan JobsPage biar transisinya mulus) */}
            <div className="pointer-events-none absolute inset-0 opacity-80 z-0">
                <div className="absolute inset-0 bg-linear-to-br from-[#050C24] via-[#060A1B] to-[#0A0F1D]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,163,255,0.35),transparent_45%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(107,77,255,0.25),transparent_40%)]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%27120%27 height=%27120%27 viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-opacity=%270.15%27%3E%3Cpath d=%27M0 0h160v160H0z%27/%3E%3Cpath d=%27M0 0l160 160m0-160L0 160%27 stroke=%27%23ffffff%27 stroke-opacity=%270.08%27/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
                {/* Header */}
                <DashboardHeader
                    actions={
                        <div className="flex items-center gap-4">
                            {/* Bisa tambah tombol back atau actions lain disini */}
                        </div>
                    }
                />

                <div className="flex w-full flex-col gap-6 lg:flex-row">
                    {/* Sidebar */}
                    <aside className="hidden w-60 shrink-0 lg:flex xl:w-64">
                        {/* Kirim activeNav 'jobs' supaya menu Jobs tetap nyala */}
                        <DashboardSidebar activeNav="jobs" />
                    </aside>

                    <main className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white">Create Job</h1>
                            <div className="text-sm text-gray-400">
                                <Link href="/jobs" className="hover:text-white transition">Job</Link>
                                <span className="mx-2">/</span>
                                <span className="text-[#2E7FFF] font-medium">Create Jobs</span>
                            </div>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-6">

                            {/* LEFT COLUMN - FORM AREA */}
                            <div className="flex-1 space-y-6">

                                {/* SECTION 1: Company Details */}
                                <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 md:p-8 backdrop-blur shadow-xl">
                                    <h2 className="mb-6 text-lg font-semibold text-white border-b border-white/5 pb-4">
                                        Company Details
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Logo Upload */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-2`}>Company Logo :</label>
                                            <div className="flex items-center justify-center w-24 h-24 rounded-xl border border-dashed border-white/20 bg-[#0A1325] hover:border-[#2E7FFF] hover:bg-[#0E1A35] transition cursor-pointer group">
                                                <div className="flex flex-col items-center gap-1">
                                                    <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-[#2E7FFF]" />
                                                    <span className="text-[10px] text-gray-500">Upload Here</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Company Name */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Company Name :</label>
                                            <input type="text" placeholder="Type Here" className={inputClass} />
                                        </div>

                                        {/* Location */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Location :</label>
                                            <input type="text" placeholder="Type Here" className={inputClass} />
                                        </div>
                                    </div>
                                </section>

                                {/* SECTION 2: Title Details */}
                                <section className="rounded-[28px] border border-white/10 bg-[#040f25]/80 p-6 md:p-8 backdrop-blur shadow-xl">
                                    <h2 className="mb-6 text-lg font-semibold text-white border-b border-white/5 pb-4">
                                        Title Details
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Title Name */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Title Name :</label>
                                            <input type="text" placeholder="Type Here" className={inputClass} />
                                        </div>

                                        {/* Description */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Job Description :</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Type Here"
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>

                                        {/* Requirements (Dynamic) */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Requirement :</label>
                                            <div className="w-full space-y-3">
                                                {requirements.map((req, idx) => (
                                                    <input
                                                        key={idx}
                                                        type="text"
                                                        value={req}
                                                        onChange={(e) => updateRequirement(idx, e.target.value)}
                                                        placeholder="Type Here"
                                                        className={inputClass}
                                                    />
                                                ))}
                                                <button
                                                    onClick={addRequirement}
                                                    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:border-[#2E7FFF] transition"
                                                >
                                                    <Plus className="w-4 h-4" /> Add More
                                                </button>
                                            </div>
                                        </div>

                                        {/* Job Type */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Job Type :</label>
                                            <div className="relative w-full">
                                                <input type="text" placeholder="Full Time / Remote" className={inputClass} />
                                            </div>
                                        </div>

                                        {/* Salary (Range) */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Salary (Optional) :</label>
                                            <div className="flex w-full items-center gap-3">
                                                <input type="text" placeholder="Min" className={inputClass} />
                                                <span className="text-gray-500">-</span>
                                                <input type="text" placeholder="Max" className={inputClass} />
                                            </div>
                                        </div>

                                        {/* Close At (Date) */}
                                        <div className={inputContainerClass}>
                                            <label className={`${labelClass} pt-3`}>Close At :</label>
                                            <div className="grid grid-cols-3 gap-3 w-full">
                                                <div className="relative">
                                                    <select className={`${inputClass} appearance-none cursor-pointer`}>
                                                        <option>DD</option>
                                                        {/* Logic tgl 1-31 */}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                                </div>
                                                <div className="relative">
                                                    <select className={`${inputClass} appearance-none cursor-pointer`}>
                                                        <option>MM</option>
                                                        {/* Logic bln 1-12 */}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                                </div>
                                                <div className="relative">
                                                    <select className={`${inputClass} appearance-none cursor-pointer`}>
                                                        <option>YY</option>
                                                        <option>2025</option>
                                                        <option>2026</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </section>

                                {/* Submit Button */}
                                <button className="w-full rounded-2xl bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(35,119,255,0.45)] hover:shadow-[0_15px_40px_rgba(35,119,255,0.6)] transition-all transform hover:-translate-y-0.5">
                                    + Add Job
                                </button>

                            </div>

                            {/* RIGHT COLUMN - INFO AREA */}
                            <div className="w-full xl:w-80 flex flex-col gap-6">

                                {/* Info Card */}
                                <div className="rounded-[28px] border border-white/10 bg-[#030b1e]/90 p-6 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7FFF]/10 blur-[50px] rounded-full" />

                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0A1835] to-[#040A18] border border-white/10 flex items-center justify-center mb-4 shadow-inner">
                                        <Briefcase className="w-8 h-8 text-[#5FB6FF]" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mb-2">Post Job And Earn</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Open a job application and earn dust point increase your reputation and make more credibility at trustydust
                                    </p>
                                </div>

                                {/* Trust Score Booster Card (Optional dari UI kiri bawah di gambar) */}
                                <div className="rounded-[28px] border border-white/10 bg-[#050C24] p-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#2E7FFF]/5 to-[#6B4DFF]/5 opacity-0 group-hover:opacity-100 transition duration-500" />

                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-[#2E7FFF]/20">
                                            <ShieldCheck className="w-5 h-5 text-[#7BDFFF]" />
                                        </div>
                                        <span className="text-sm font-semibold text-white">Boost Trust Score</span>
                                    </div>

                                    <div className="text-2xl font-bold text-white mb-2">4000</div>

                                    <div className="h-2 w-full bg-[#0A1325] rounded-full overflow-hidden">
                                        <div className="h-full w-[40%] bg-gradient-to-r from-[#2E7FFF] to-[#6B4DFF] rounded-full" />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}