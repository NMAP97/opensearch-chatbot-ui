import { NextRequest, NextResponse } from 'next/server'

export const config = {
    api: {
        // Enable `externalResolver` option in Next.js
        externalResolver: true,
        bodyParser: true,
        compress: true
    }
}

function copyHeaders(headers: Headers, skipHeaders: string[]) {

    const new_headers: Record<string, string> = {};
    headers.forEach((value, key) => {
        if (!skipHeaders.includes(key.toLowerCase().trim())) {
            new_headers[key] = value;
        }
    });

    return new_headers;
}

const handler = async (nextRequest: NextRequest, nextResponse: NextResponse) => {
    const endpoint = process.env.OPENSEARCH_ENDPOINT;
    const url = nextRequest.url.replace(new RegExp("^.*/api/opensearch", "gi"), endpoint + "");

    const response = await fetch(url, {
        method: nextRequest.method,
        headers: copyHeaders(nextRequest.headers, ['content-encoding', 'content-length']),
        body: nextRequest.body,
        duplex: 'half'
    } as RequestInit)


    return new NextResponse(response.body, {
        headers: copyHeaders(response.headers, ['content-encoding', 'content-length', 'content-type']),
        status: response.status,
        statusText: response.statusText,
    })
}

export { handler as GET, handler as POST, handler as DELETE, handler as PUT, handler as HEAD }
