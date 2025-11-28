import { API_PREFIX, PROXY_BASE_URL } from '@/constant/api';
import { cookies } from 'next/headers';

async function proxyRequest(
  request: Request,
  { params }: { params: Promise<{ path: string | string[] }> },
) {
  const API_ENDPOINT = process.env.API_BASE_URL;
  const { path } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value || '';

  let targetPath = Array.isArray(path) ? path.join('/') : path;
  targetPath = targetPath.split('api/proxy')[1]

  const url = new URL(request.url);
  const queryString = url.search || '';

  const targetUrl = `${API_ENDPOINT}${API_PREFIX}${targetPath}${queryString}`;

  const requestHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    requestHeaders[key] = value;

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
    requestHeaders['accept-encoding'] = 'gzip, deflate, br';
  });

  let bodyContent: string | null = null;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (request.body) {
      bodyContent = await request.text();
    }
  }

  if (targetPath === 'auth/login') {
    requestHeaders['accept-encoding'] = 'gzip, deflate, br';
  }

  const fetchResponse = await fetch(targetUrl, {
    method: request.method,
    headers: requestHeaders,
    body: bodyContent,
  });

  const responseHeaders = new Headers();
  fetchResponse.headers.forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  if (targetPath === '/auth/login' && fetchResponse.ok) {
    const responseData = await fetchResponse.json();

    if (responseData.data.jwt) {
      cookieStore.set({
        name: 'jwt',
        value: responseData.data.jwt,
      });
    }

    const removeJwtData = {
      ...responseData,
      data: { ...responseData.data, jwt: undefined },
    };

    return new Response(JSON.stringify(removeJwtData), {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
    });
  }

  const contentType = fetchResponse
    .headers
    .get("content-type") || "";

  if (
    contentType.includes("text/csv") ||
    contentType.includes("application/csv")
  ) {
    const res = await fetchResponse.text();
    return new Response(res, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": responseHeaders.get("content-disposition") ?? "",
      },
    });
  }

  if (
    contentType.includes("application/xml") ||
    contentType.includes("application/xhtml+xml")
  ) {
    const res = await fetchResponse.text();
    return new Response(res, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (contentType.includes("application/json")) {
    const res = await fetchResponse.json();
    return new Response(JSON.stringify(res), {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,

    });
  }

  const res = await fetchResponse.blob();
  return new Response(res, {
    status: fetchResponse.status,
    statusText: fetchResponse.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> },
) {
  return proxyRequest(request, { params });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> },
) {
  return proxyRequest(request, { params });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> },
) {
  return proxyRequest(request, { params });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> },
) {
  return proxyRequest(request, { params });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> },
) {
  return proxyRequest(request, { params });
}

export async function OPTIONS(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> },
) {
  return proxyRequest(request, { params });
}

export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> },
) {
  return proxyRequest(request, { params });
}
