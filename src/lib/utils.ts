
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const reqQueryUrl = (
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
): string => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") continue;
    params.append(key, String(value));
  }

  const queryString = params.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};