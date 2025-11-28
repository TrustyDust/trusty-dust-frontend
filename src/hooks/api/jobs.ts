import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"
import type {
  JobWithMeta,
  JobApplicationWithJob,
  JobApplicationWithWorker,
  JobSearchResponse,
  JobSearchItem,
  Job,
  CreateJobRequest,
  JobApplication,
  ApplyJobBody,
  SubmitWorkBody,
  ConfirmWorkBody,
} from "@/types/api"

export const useMyJobsApi = () =>
  useQuery<JobWithMeta[]>({
    queryKey: ["jobs-me"],
    queryFn: () => get<JobWithMeta[]>(API_ROUTES.jobs.myJobs),
  })

export const useMyApplicationsApi = () =>
  useQuery<JobApplicationWithJob[]>({
    queryKey: ["jobs-applications-me"],
    queryFn: () => get<JobApplicationWithJob[]>(API_ROUTES.jobs.myApplications),
  })

export const useJobApplicantsApi = (id: string) =>
  useQuery<JobApplicationWithWorker[]>({
    queryKey: ["job-applicants", id],
    queryFn: () => get<JobApplicationWithWorker[]>(API_ROUTES.jobs.applicants(id)),
    enabled: !!id,
  })

export const useSearchJobsApi = (query: string) =>
  useQuery<JobSearchResponse>({
    queryKey: ["jobs-search", query],
    queryFn: () => get<JobSearchResponse>(`${API_ROUTES.jobs.search}?q=${encodeURIComponent(query)}`),
    enabled: !!query,
  })

export const useHotJobsApi = () =>
  useQuery<JobSearchItem[]>({
    queryKey: ["jobs-hot"],
    queryFn: () => get<JobSearchItem[]>(API_ROUTES.jobs.hot),
  })

export const useCreateJobApi = () =>
  useMutation<Job, Error, CreateJobRequest>({
    mutationFn: (body) => post<Job>(API_ROUTES.jobs.create, body),
  })

export const useApplyJobApi = (id: string) =>
  useMutation<JobApplication, Error, ApplyJobBody | undefined>({
    mutationFn: (body) => post<JobApplication>(API_ROUTES.jobs.apply(id), body),
  })

export const useSubmitWorkApi = (id: string) =>
  useMutation<JobApplication, Error, SubmitWorkBody>({
    mutationFn: (body) => post<JobApplication>(API_ROUTES.jobs.submitWork(id), body),
  })

export const useConfirmWorkApi = (id: string) =>
  useMutation<JobApplication, Error, ConfirmWorkBody | undefined>({
    mutationFn: (body) => post<JobApplication>(API_ROUTES.jobs.confirmWork(id), body),
  })

