'use client'

import { FormEvent, useMemo, useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { useApplyJobApi } from "@/hooks/api/jobs"
import { getErrorMessage } from "@/lib/get-error-message"

interface ApplyJobModalProps {
  isOpen: boolean
  onClose: () => void
  jobId?: string
  jobTitle?: string
}

export function ApplyJobModal({ isOpen, onClose, jobId, jobTitle }: ApplyJobModalProps) {
  const [links, setLinks] = useState<string[]>([""])
  const [cvUrl, setCvUrl] = useState("")
  const [note, setNote] = useState("")
  const applyJob = useApplyJobApi(jobId ?? "")

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0A1325] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF] transition-all"
  const labelClass = "text-sm font-medium text-gray-300 mb-2 block"

  const isDisabled = !jobId || applyJob.isPending

  const filteredLinks = useMemo(() => links.map((link) => link.trim()).filter(Boolean), [links])

  const resetForm = () => {
    setLinks([""])
    setCvUrl("")
    setNote("")
  }

  const addLink = () => setLinks((prev) => [...prev, ""])

  const updateLink = (index: number, value: string) => {
    setLinks((prev) => prev.map((item, idx) => (idx === index ? value : item)))
  }

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!jobId) {
      toast.error("Job is not available")
      return
    }
    try {
      await applyJob.mutateAsync({
        cvUrl: cvUrl.trim() || undefined,
        portfolioLinks: filteredLinks,
        extraMetadata: note.trim() ? { note: note.trim() } : undefined,
      })
      toast.success("Application submitted!")
      resetForm()
      onClose()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-[24px] border border-white/10 bg-[#050C24] p-6 shadow-2xl">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <div className="w-8" aria-hidden />
            <h2 className="text-xl font-bold text-white">Apply to this job</h2>
            <button
              type="button"
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {jobTitle && (
            <p className="text-center text-sm font-medium text-[#2E7FFF]">Applying for: {jobTitle}</p>
          )}

          <div>
            <label className={labelClass}>CV or Resume URL</label>
            <input
              type="url"
              value={cvUrl}
              onChange={(event) => setCvUrl(event.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Portfolio Links</label>
            <div className="space-y-3">
              {links.map((link, idx) => (
                <div key={`portfolio-${idx}`} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(event) => updateLink(idx, event.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400 transition hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-2.5 text-sm text-gray-400 transition hover:border-[#2E7FFF] hover:bg-[#2E7FFF]/5 hover:text-white"
              >
                <Plus className="h-4 w-4" /> Add Link
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Additional Notes</label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Share anything else the job owner should know..."
              className="h-24 w-full rounded-xl border border-white/10 bg-[#0A1325] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#2E7FFF] focus:outline-none focus:ring-1 focus:ring-[#2E7FFF]"
            />
          </div>

          {applyJob.error && (
            <p className="text-xs font-medium text-red-400">{getErrorMessage(applyJob.error)}</p>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-full bg-linear-to-r from-[#2E7FFF] to-[#6B4DFF] py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(35,119,255,0.35)] transition hover:shadow-[0_20px_60px_rgba(35,119,255,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {applyJob.isPending ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  )
}