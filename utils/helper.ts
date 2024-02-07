import { ChatContext, ClusterSettings } from "@/components"
import { useContext } from "react"

const getOpenSearchProxyConfig = () => {
    const endpoint = process.env.NEXT_PUBLIC_OPENSEARCH_PROXY
    return { endpoint }
}

export const getRequest = async (clusterSettings: ClusterSettings, url: string, params: any) => {
    if (params) {
        url = url + '?' + new URLSearchParams(params)
    }
    return sendRequest(clusterSettings, url, 'GET', null)
}


export const sendRequest = async (clusterSettings: ClusterSettings, url: string, method: string, data?: any) => {

    const { endpoint: proxy_endpoint } = getOpenSearchProxyConfig();

    return await fetch(proxy_endpoint + url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            'Destination': clusterSettings.endpoint
        },
        body: data && JSON.stringify(data)
    })
}