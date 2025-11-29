/* eslint-disable @typescript-eslint/no-explicit-any */

import { PROXY_BASE_URL } from "@/constant/api";
import { HttpRequestMethod } from "@/types/enum";

export class ApiError extends Error {
    constructor(public status: number, message: string, public data?: any) {
        super(message);
        this.name = "ApiError";

        // Fix prototype chain
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export const handleErrorResponse = (status: number, data: any) => {
    const message =
        data?.message ||
        data?.error ||
        data?.detail ||
        defaultMessages[status] ||
        "Unexpected error occurred";

    throw new ApiError(status, message, data);
};

const defaultMessages: Record<number, string> = {
    400: "Bad request",
    401: "Unauthorized",
    404: "Resource not found",
    502: "Network error",
};

export interface RequestOptions {
    method?: HttpRequestMethod;
    body?: any;
    headers?: Record<string, string>;
    cache?: RequestCache;
    revalidate?: number;
    retry?: number;
}


const buildUrl = (endpoint: string) => {
    const base = PROXY_BASE_URL.replace(/\/+$/, "");
    const clean = endpoint.replace(/^\/+/, "");
    return `${base}/${clean}`;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json"))
        return (await response.json()) as T;

    if (contentType.includes("text/"))
        return (await response.text()) as T;

    if (
        contentType.includes("application/pdf") ||
        contentType.includes("application/octet-stream") ||
        contentType.includes("application/vnd")
    )
        return (await response.blob()) as unknown as T;

    // Fallback
    return (await response.text()) as T;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
        method = HttpRequestMethod.Get,
        body,
        headers = {},
        retry = 0,
        ...fetchOptions
    } = options;

    const url = endpoint

    const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    const computedHeaders: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    };

    const contentTypeKey = Object.keys(computedHeaders).find(
        (key) => key.toLowerCase() === "content-type"
    );

    if (isFormData && contentTypeKey) {
        delete computedHeaders[contentTypeKey];
    } else if (!isFormData && !contentTypeKey) {
        computedHeaders["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
        method,
        headers: computedHeaders,
        ...fetchOptions,
    };

    if (body !== undefined && body !== null && method !== HttpRequestMethod.Get) {
        config.body = isFormData ? body : JSON.stringify(body);
    }

    let attempt = 0;

    while (true) {
        const response = await fetch(url, config);

        // If OK ⇒ langsung parse
        if (response.ok) return parseResponse<T>(response);

        // If error ⇒ coba parse error payload
        let errorData: any = {};
        try {
            errorData = await response.json();
        } catch (_) {}

        // If retry available
        if (attempt < retry) {
            attempt++;
            continue;
        }

        return handleErrorResponse(response.status, errorData);
    }
}

export const get = <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: HttpRequestMethod.Get });

export const post = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: HttpRequestMethod.Post, body });

export const put = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: HttpRequestMethod.Put, body });

export const patch = <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: HttpRequestMethod.Patch, body });

export const del = <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: HttpRequestMethod.Delete });
