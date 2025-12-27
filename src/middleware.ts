import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://redcrow.kz',
    'https://www.redcrow.kz'
];

export function middleware(request: NextRequest) {
    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const response = NextResponse.next();

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
}

export const config = {
    matcher: '/api/:path*',
}