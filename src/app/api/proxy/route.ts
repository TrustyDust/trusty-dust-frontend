import { NextRequest, NextResponse } from "next/server"

const targetBase = process.env.API_PROXY_TARGET

function assertTargetBase() {
  if (!targetBase) {
    throw new Error("API_PROXY_TARGET env var is not set")
  }
}

function buildTargetUrl(path: string, search: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return new URL(`${normalized}${search}`, targetBase)
}

async function handleProxy(request: NextRequest) {
  assertTargetBase()

  const path = request.nextUrl.searchParams.get("path") ?? ""
  const targetUrl = buildTargetUrl(path, request.nextUrl.search)

  // Strip the `path` param from forwarded query to avoid duplicates.
  targetUrl.searchParams.delete("path")

  const init: RequestInit = {
    method: request.method,
    headers: Object.fromEntries(
      Array.from(request.headers.entries()).filter(
        ([key]) => !["host", "connection", "content-length"].includes(key.toLowerCase()),
      ),
    ),
    redirect: "manual",
  }

  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer()
  }

  const upstream = await fetch(targetUrl, init)

  // Clone response headers to return to client.
  const headers = new Headers(upstream.headers)
  headers.delete("content-encoding")
  headers.delete("content-length")
  headers.delete("transfer-encoding")

  const body = upstream.body ? upstream.body : null
  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
}

export async function GET(request: NextRequest) {
  return handleProxy(request)
}

export async function POST(request: NextRequest) {
  return handleProxy(request)
}

export async function PUT(request: NextRequest) {
  return handleProxy(request)
}

export async function PATCH(request: NextRequest) {
  return handleProxy(request)
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request)
}
