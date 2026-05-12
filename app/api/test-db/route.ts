import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/test-db")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = await getSession();

  return NextResponse.next();
}