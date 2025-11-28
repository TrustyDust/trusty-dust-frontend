import { API_PREFIX } from "@/constant/api"
import { cookies } from "next/headers"

async function proxyRequest(
  request: Request,
  { params }: { params: Promise<{ path: string | string[] }> }
) {
  const API_ENDPOINT = process.env.API_BASE_URL
  const { path } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("jwt")?.value || ""

  let targetPath = Array.isArray(path) ? path.join("/") : path

  targetPath = targetPath.replace(/^\/+/, "").replace(/^api\/proxy\/?/, "")

  if (!targetPath.startsWith("/")) {
    targetPath = "/" + targetPath
  }

  const url = new URL(request.url)
  const queryString = url.search || ""

  const targetUrl = `${API_ENDPOINT}${API_PREFIX}${targetPath}${queryString}`

  const requestContentType = request.headers.get("content-type") || ""
  const isMultipartFormData = requestContentType.includes("multipart/form-data")

  const requestHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    const skipHeaders = [
      "accept-encoding",
      "host",
      "connection",
      "upgrade",
      "keep-alive",
    ]
    if (skipHeaders.includes(key.toLowerCase())) {
      return
    }
    requestHeaders[key] = value
  })

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`
  }

  let bodyContent: string | ArrayBuffer | Blob | null = null

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (request.body) {
      if (isMultipartFormData) {
        bodyContent = await request.arrayBuffer()
      } else {
        bodyContent = await request.text()
      }
    }
  }

  const fetchResponse = await fetch(targetUrl, {
    method: request.method,
    headers: requestHeaders,
    body: bodyContent,
  })

  const statusCodesWithoutBody = [204, 304]
  const hasNoBody = statusCodesWithoutBody.includes(fetchResponse.status)

  if (hasNoBody) {
    const noBodyHeaders = new Headers()
    fetchResponse.headers.forEach((value, key) => {
      const skipHeaders = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "content-type",
      ]
      if (skipHeaders.includes(key.toLowerCase())) {
        return
      }
      noBodyHeaders.set(key, value)
    })
    return new Response(null, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: noBodyHeaders,
    })
  }

  const responseHeaders = new Headers()
  fetchResponse.headers.forEach((value, key) => {
    const skipHeaders = [
      "content-encoding",
      "content-length",
      "transfer-encoding",
    ]
    if (skipHeaders.includes(key.toLowerCase())) {
      return
    }
    responseHeaders.set(key, value)
  })

  if (targetPath === "/auth/login" && fetchResponse.ok) {
    const responseData = await fetchResponse.json()

    if (responseData.jwt) {
      cookieStore.set({
        name: "jwt",
        value: responseData.jwt,
      })
    }

    const removeJwtData = {
      ...responseData,
      data: { ...responseData.data, jwt: undefined },
    }

    return new Response(JSON.stringify(removeJwtData), {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const contentType = fetchResponse.headers.get("content-type") || ""

  if (
    contentType.includes("text/csv") ||
    contentType.includes("application/csv")
  ) {
    const res = await fetchResponse.text()
    return new Response(res, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": responseHeaders.get("content-disposition") ?? "",
      },
    })
  }

  if (
    contentType.includes("application/xml") ||
    contentType.includes("application/xhtml+xml")
  ) {
    const res = await fetchResponse.text()
    return new Response(res, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: { "Content-Type": "text/plain" },
    })
  }

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("multipart/")
  ) {
    const res = await fetchResponse.blob()
    responseHeaders.delete("content-encoding")
    responseHeaders.delete("transfer-encoding")
    responseHeaders.set("content-type", contentType)
    return new Response(res, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: responseHeaders,
    })
  }

  if (contentType.includes("application/json")) {
    const res = await fetchResponse.json()
    responseHeaders.delete("content-encoding")
    responseHeaders.delete("content-length")
    responseHeaders.delete("transfer-encoding")
    responseHeaders.set(
      "content-type",
      responseHeaders.get("content-type") ?? "application/json"
    )
    return new Response(JSON.stringify(res), {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: responseHeaders,
    })
  }

  const res = await fetchResponse.blob()
  responseHeaders.delete("content-encoding")
  responseHeaders.delete("transfer-encoding")
  return new Response(res, {
    status: fetchResponse.status,
    statusText: fetchResponse.statusText,
    headers: responseHeaders,
  })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> }
) {
  return proxyRequest(request, { params })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> }
) {
  return proxyRequest(request, { params })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> }
) {
  return proxyRequest(request, { params })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> }
) {
  return proxyRequest(request, { params })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> }
) {
  return proxyRequest(request, { params })
}

export async function OPTIONS(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> }
) {
  return proxyRequest(request, { params })
}

export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ path: string[] | string }> }
) {
  return proxyRequest(request, { params })
}
