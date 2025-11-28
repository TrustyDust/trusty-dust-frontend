// src/hooks/useJobs.ts
import {
  useMyJobsApi,
  useMyApplicationsApi,
  useJobApplicantsApi,
  useSearchJobsApi,
  useHotJobsApi,
  useCreateJobApi,
  useApplyJobApi,
  useSubmitWorkApi,
  useConfirmWorkApi,
} from "../api/jobs"

export const useJobsViewModel = () => {
  const myJobs = useMyJobsApi()
  const myApplications = useMyApplicationsApi()
  const hotJobs = useHotJobsApi()

  return { myJobs, myApplications, hotJobs }
}

export const useMyJobs = useMyJobsApi
export const useMyApplications = useMyApplicationsApi
export const useJobApplicants = useJobApplicantsApi
export const useSearchJobs = useSearchJobsApi
export const useHotJobs = useHotJobsApi
export const useCreateJob = useCreateJobApi
export const useApplyJob = useApplyJobApi
export const useSubmitWork = useSubmitWorkApi
export const useConfirmWork = useConfirmWorkApi
