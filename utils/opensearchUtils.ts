import { ClusterSettings } from "@/components";
import { getRequest, sendRequest } from "./helper";

function throwError(json: Record<string, any>): { message: string } {
    throw {
        message: json.code == "PROXY_ERROR" ? json.message : json.error.reason,
    }
}

export async function createConversation(clusterSettings: ClusterSettings, name: string) {
    const data = {
        name
    };

    const response = await sendRequest(clusterSettings, '/_plugins/_ml/memory/conversation', 'POST', data);

    const status = response.status;

    const json = await response.json();

    if (status == 200) {
        return json;
    }
    else {
        throwError(json)
    }
}

export async function getConversations(clusterSettings: ClusterSettings, max_results: number, next_token: number) {
    const params = {
        max_results,
        next_token
    };

    const response = await getRequest(clusterSettings, '/_plugins/_ml/memory/conversation', params);

    const json = await response.json();

    const status = response.status;

    if (status == 200) {
        return json;
    }
    else {
        throwError(json)
    }
}

export interface OpenSearchSearchParams {
    conversationId: string,
    input: string,
    prompt: string,
    model: string,
    indexName: string,
    pipelineName: string,
}

export async function searchRAG(clusterSettings: ClusterSettings, { conversationId, input, prompt, model, indexName, pipelineName }: OpenSearchSearchParams) {
    const data = {
        "query": {
            "match": {
                "text": {
                    "query": input
                }
            }
        },
        "ext": {
            "generative_qa_parameters": {
                "llm_model": model,
                "llm_question": input + prompt,
                "conversation_id": conversationId,
                "context_size": 2,
                "interaction_size": 1,
                "timeout": 30
            }
        }
    }

    const response = await sendRequest(clusterSettings, `/${indexName}/_search?search_pipeline=${pipelineName}`, 'POST', data);

    const json = await response.json();

    const status = response.status;

    if (status == 200) {
        return json;
    }
    else {
        throwError(json)
    }
}

export async function getInteractions(clusterSettings: ClusterSettings, conversation_id: string, max_results: number, next_token: number) {
    const params = {
        max_results,
        next_token
    };

    const response = await getRequest(clusterSettings, '/_plugins/_ml/memory/conversation/' + conversation_id, params);

    const json = await response.json();

    const status = response.status;

    if (status == 200) {
        return json;
    }
    else {
        throwError(json)
    }
}

export async function deleteConversation(clusterSettings: ClusterSettings, conversationId: string) {
    const response = await sendRequest(clusterSettings, '/_plugins/_ml/memory/conversation/' + conversationId, 'DELETE');

    const status = response.status;

    const json = await response.json();

    if (status == 200) {
        return json;
    }
    else {
        throwError(json)
    }
}