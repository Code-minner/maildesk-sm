// Middleware disabled — auth is handled in each page directly
import { NextResponse } from "next/server";
export function middleware(request) {
  return NextResponse.next();
}