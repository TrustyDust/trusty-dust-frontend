// src/hooks/useSocial.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post } from "@/lib/http-client";

export const useFeed = () =>
    useQuery({
        queryKey: ["social-feed"],
        queryFn: () => get("/api/v1/social/posts"),
    });

export const useCreatePost = () =>
    useMutation({
        mutationFn: (body: any) => post("/api/v1/social/posts", body),
    });

export const usePostDetail = (id: string) =>
    useQuery({
        queryKey: ["post-detail", id],
        queryFn: () => get(`/api/v1/social/posts/${id}`),
        enabled: !!id,
    });

export const useReactPost = (id: string) =>
    useMutation({
        mutationFn: (body: any) => post(`/api/v1/social/posts/${id}/react`, body),
    });

export const useBoostPost = (id: string) =>
    useMutation({
        mutationFn: () => post(`/api/v1/social/posts/${id}/boost`),
    });
