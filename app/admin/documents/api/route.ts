import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
    try {
        // Get query parameters from the request
        const searchParams = request.nextUrl.searchParams;
        const skip = searchParams.get('skip') || '0';
        const limit = searchParams.get('limit') || '10';
        
        // Forward request to backend
        const response = await fetch(`${BACKEND_URL}/api/v1/documents?skip=${skip}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            cache: 'no-store'
        });

        // Get response data
        const data = await response.json();
        
        // Return backend response
        return NextResponse.json(
            data,
            { status: response.status }
        );
    } catch (error) {
        console.error('Documents API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        );
    }
}