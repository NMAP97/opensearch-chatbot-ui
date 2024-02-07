import { NextRequest, NextResponse } from 'next/server'

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

    const destionation = nextRequest.headers.get('destination');

    const url = nextRequest.url.replace(new RegExp("^.*/api/opensearch", "gi"), destionation!);

    try {
        const response = await fetch(url, {
            method: nextRequest.method,
            headers: copyHeaders(nextRequest.headers, ['content-encoding', 'content-length', 'destionation']),
            body: nextRequest.body,
            duplex: 'half'
        } as RequestInit)

        return new NextResponse(response.body, {
            headers: copyHeaders(response.headers, ['content-encoding', 'content-length', 'content-type']),
            status: response.status,
            statusText: response.statusText,
        })
    }
    catch (err: any) {
        const code = "PROXY_ERROR";
        let message;
        if (err instanceof Error) {
            message = err.message;
            const _cause = err.cause;
            if (_cause instanceof Error) {
                const cause = _cause as any
                message += (cause.message || " - " + cause.message)
                message += (cause.code || " - " + cause.code)
            }
        }
        else if (err instanceof String) {
            message = err;
        }
        else {
            message = 'Unknown Error occurred in proxy'
        }
        console.log(err);
        return NextResponse.json(
            { code, message },
            { status: 500 }
        )
    }
}

export { handler as GET, handler as POST, handler as DELETE, handler as PUT, handler as HEAD }
