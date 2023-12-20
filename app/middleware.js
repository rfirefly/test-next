import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(req) {
  console.log("===request", req.method, req.url);
  return NextResponse.next();
}

