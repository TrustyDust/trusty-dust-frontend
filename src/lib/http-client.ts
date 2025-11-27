/* eslint-disable @typescript-eslint/no-explicit-any */


import { PROXY_BASE_URL } from "@/constant/api";
import { HttpRequestMethod } from "@/types/enum";

export const handleErrorResponse = function (error: any) {
    if (error && error.response) {
        const serverMessage = error.response.data?.message;
        const status = error.response.status;

        let message: string;

        switch (status) {
            case 401:
                message = serverMessage || "Bad credentials";
                break;
            case 400:
                message = serverMessage || "Bad request";
                break;
            case 502:
                message = serverMessage || "Network error";
                break;
            case 404:
                message = serverMessage || "Resource not found";
                break;
            default:
                message = serverMessage || "Unexpected error occurred";
        }

        throw new ApiError(status, message);
    }

    throw new ApiError(500, "Unexpected error occurred");
};

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

export interface RequestOptions {
    method?: HttpRequestMethod;
    body?: any;
    headers?: Record<string, string>;
    cache?: RequestCache;
    revalidate?: number;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = HttpRequestMethod.Get, body, headers = {}, ...fetchOptions } = options;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...fetchOptions,
    };

    if (body && method !== HttpRequestMethod.Get) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${PROXY_BASE_URL}/${cleanEndpoint}`, config);
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        handleErrorResponse({
            response: {
                status: response.status,
                data: errorData,
            },
        });
    }

    if (
        contentType.includes("text/csv") ||
        contentType.includes("application/csv") ||
        contentType.includes("application/xml") ||
        contentType.includes("application/xhtml+xml")
    ) {
        const result = await response.text();
        return result as T;
    }

    const result = await response.json();
    return result;
}

export function get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(endpoint, { ...options, method: HttpRequestMethod.Get });
}

export function post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method">) {
    return request<T>(endpoint, { ...options, method: HttpRequestMethod.Post, body });
}

export function put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method">) {
    return request<T>(endpoint, { ...options, method: HttpRequestMethod.Put, body });
}

export function patch<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method">) {
    return request<T>(endpoint, { ...options, method: HttpRequestMethod.Patch, body });
}

export function del<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(endpoint, { ...options, method: HttpRequestMethod.Delete });
}
