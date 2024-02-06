const getOpenSearchApiConfig = () => {
    const endpoint = process.env.NEXT_PUBLIC_OPENSEARCH_ENDPOINT
    const username = process.env.NEXT_PUBLIC_OPENSEARCH_USERNAME
    const password = process.env.NEXT_PUBLIC_OPENSEARCH_PASSWORD

    return { endpoint, username, password }
}

export const getRequest = async (url: string, params: any) => {
    if (params) {
        url = url + '?' + new URLSearchParams(params)
    }
    return sendRequest(url, 'GET', null)
}


export const sendRequest = async (url: string, method: string, data?: any) => {

    let { endpoint, username, password } = getOpenSearchApiConfig();

    return await fetch(endpoint + url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
        body: data && JSON.stringify(data)
    })
}