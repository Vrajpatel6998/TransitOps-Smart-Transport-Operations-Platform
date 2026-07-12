import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const PROXY_CONFIG = {
  target: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
};
