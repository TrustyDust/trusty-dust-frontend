import { useQuery, useMutation } from "@tanstack/react-query"
import { get, post } from "@/lib/http-client"
import { API_ROUTES } from "@/constant/api"

export const useMyJobsApi = () =>
  useQuery({
    queryKey: ["jobs-me"],
    queryFn: () => get(API_ROUTES.jobs.myJobs),
  })

export const useMyApplicationsApi = () =>
  useQuery({
    queryKey: ["jobs-applications-me"],
    queryFn: () => get(API_ROUTES.jobs.myApplications),
  })

export const useJobApplicantsApi = (id: string) =>
  useQuery({
    queryKey: ["job-applicants", id],
    queryFn: () => get(API_ROUTES.jobs.applicants(id)),
    enabled: !!id,
  })

export const useSearchJobsApi = (query: string) =>
  useQuery({
    queryKey: ["jobs-search", query],
    queryFn: () => get(`${API_ROUTES.jobs.search}?q=${encodeURIComponent(query)}`),
    enabled: !!query,
  })

export const useHotJobsApi = () =>
  useQuery({
    queryKey: ["jobs-hot"],
    queryFn: () => get(API_ROUTES.jobs.hot),
  })

export const useCreateJobApi = () =>
  useMutation({
    mutationFn: (body: unknown) => post(API_ROUTES.jobs.create, body),
  })

export const useApplyJobApi = () =>
  useMutation({
    mutationFn: ({ id }: { id: string }) => post(API_ROUTES.jobs.apply(id)),
  })

export const useSubmitWorkApi = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: unknown }) => post(API_ROUTES.jobs.submitWork(id), body),
  })

export const useConfirmWorkApi = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body?: unknown }) => post(API_ROUTES.jobs.confirmWork(id), body),
  })

