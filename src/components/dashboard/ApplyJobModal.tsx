'use client'

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

interface ApplyJobModalProps {
    isOpen: boolean
    onClose: () => void
    jobTitle?: string
}

export function ApplyJobModal({ isOpen, onClose, jobTitle }: ApplyJobModalProps) {
    // Logic untuk dynamic portfolio links
    const [links, setLinks] = useState<string[]>([""])

    const addLink = () => {
        setLinks([...links, ""])
    }

    const updateLink = (index: number, value: string) => {
        const newLinks = [...links]
        newLinks[index] = value
        setLinks(newLinks)
    }

    const removeLink = (index: number) => {
        const newLinks = links.filter((_, i) => i !== index)
        setLinks(newLinks)
    }

    // Jika tidak open, jangan render apa-apa
    if (!isOpen) return null

    // Styling
    const inputClass = "w-full rounded-xl border border-white/10 bg-[#0A1325] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF] transition-all"
    const labelClass = "text-sm font-medium text-gray-300 mb-2 block"

    return (
        // Backdrop / Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">

            {/* Modal Content */}
            <div className="relative w-full max-w-lg rounded-[24px] border border-white/10 bg-[#050C24] p-6 shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="w-8" /> {/* Spacer biar title center */}
                    <h2 className="text-xl font-bold text-white text-center">Apply This Job</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5">

                    {/* Job Title Display (Optional) */}
                    {jobTitle && (
                        <div className="text-center text-sm text-[#2E7FFF] mb-2 font-medium">
                            Applying for: {jobTitle}
                        </div>
                    )}

                    {/* CV Upload */}
                    <div>
                        <label className={labelClass}>CV Upload</label>
                        <input
                            type="text"
                            placeholder="Type Here (or URL)"
                            className={inputClass}
                        />
                        {/* Note: Kalau mau file upload beneran, ganti type="file" */}
                    </div>

                    {/* Portfolio Links */}
                    <div>
                        <label className={labelClass}>Portfolio Link</label>
                        <div className="space-y-3">
                            {links.map((link, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={link}
                                        onChange={(e) => updateLink(idx, e.target.value)}
                                        placeholder="Type Here"
                                        className={inputClass}
                                    />
                                    {links.length > 1 && (
                                        <button
                                            onClick={() => removeLink(idx)}
                                            className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={addLink}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-sm text-gray-400 hover:text-white hover:border-[#2E7FFF] hover:bg-[#2E7FFF]/5 transition"
                            >
                                <Plus className="w-4 h-4" /> Add More
                            </button>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        <button className="w-full rounded-xl bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(35,119,255,0.35)] hover:shadow-[0_15px_40px_rgba(35,119,255,0.5)] transition-all transform hover:-translate-y-0.5">
                            Apply Now
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}