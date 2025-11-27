// src/hooks/useJobs.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post } from "@/lib/http-client";

export const useMyJobs = () =>
    useQuery({
        queryKey: ["jobs-me"],
        queryFn: () => get("/api/v1/jobs/me"),
    });

export const useMyApplications = () =>
    useQuery({
        queryKey: ["jobs-applications-me"],
        queryFn: () => get("/api/v1/jobs/applications/me"),
    });

export const useJobApplicants = (id: string) =>
    useQuery({
        queryKey: ["job-applicants", id],
        queryFn: () => get(`/api/v1/jobs/${id}/applicants`),
        enabled: !!id,
    });

export const useSearchJobs = (query: string) =>
    useQuery({
        queryKey: ["jobs-search", query],
        queryFn: () => get(`/api/v1/jobs/search?q=${query}`),
        enabled: !!query,
    });

export const useHotJobs = () =>
    useQuery({
        queryKey: ["jobs-hot"],
        queryFn: () => get("/api/v1/jobs/hot"),
    });

export const useCreateJob = () =>
    useMutation({
        mutationFn: (body: any) => post("/api/v1/jobs/create", body),
    });

export const useApplyJob = (id: string) =>
    useMutation({
        mutationFn: () => post(`/api/v1/jobs/${id}/apply`),
    });

export const useSubmitWork = (id: string) =>
    useMutation({
        mutationFn: (body: any) => post(`/api/v1/jobs/application/${id}/submit`, body),
    });

export const useConfirmWork = (id: string) =>
    useMutation({
        mutationFn: () => post(`/api/v1/jobs/application/${id}/confirm`),
    });
