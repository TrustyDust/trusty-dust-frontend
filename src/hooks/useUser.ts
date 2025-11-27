// src/hooks/useUser.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, patch, post, del } from "@/lib/http-client";

export const useMe = () =>
    useQuery({
        queryKey: ["me"],
        queryFn: () => get("/api/v1/users/me"),
    });

export const useUpdateMe = () =>
    useMutation({
        mutationFn: (body: any) => patch("/api/v1/users/me", body),
    });

export const useSearchPeople = (query: string) =>
    useQuery({
        queryKey: ["search-people", query],
        queryFn: () => get(`/api/v1/users/search/people?q=${query}`),
        enabled: !!query,
    });

export const useSuggestedUsers = () =>
    useQuery({
        queryKey: ["suggested-users"],
        queryFn: () => get("/api/v1/users/suggested"),
    });

export const useFollowUser = (id: string) =>
    useMutation({
        mutationFn: () => post(`/api/v1/users/${id}/follow`),
    });

export const useUnfollowUser = (id: string) =>
    useMutation({
        mutationFn: () => del(`/api/v1/users/${id}/follow`),
    });

export const usePublicProfile = (id: string) =>
    useQuery({
        queryKey: ["user-public", id],
        queryFn: () => get(`/api/v1/users/${id}`),
        enabled: !!id,
    });

export const useUserPosts = (id: string) =>
    useQuery({
        queryKey: ["user-posts", id],
        queryFn: () => get(`/api/v1/users/${id}/posts`),
        enabled: !!id,
    });

export const useUserJobs = (id: string) =>
    useQuery({
        queryKey: ["user-jobs", id],
        queryFn: () => get(`/api/v1/users/${id}/jobs`),
        enabled: !!id,
    });
