import { getRequest, sendRequest } from "./helper";

export interface OpenSearchAPIError {
    status: number,
    message: string,
    json: Record<string, any>
}

function throwOpenSearchError(json: Record<string, any>): OpenSearchAPIError {
    throw {
        status: json.status,
        message: json.reason,
        json: json
    }
}

export async function createConversation(name: string) {
    try {
        const data = {
            name
        };

        const response = await sendRequest('/_plugins/_ml/memory/conversation', 'POST', data);

        const json = await response.json();

        const status = response.status;

        if (status == 200) {
            return json;
        }
        else {
            throwOpenSearchError(json)
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getConversations(max_results: number, next_token: number) {
    try {
        const params = {
            max_results,
            next_token
        };

        const response = await getRequest('/_plugins/_ml/memory/conversation', params);

        const json = await response.json();

        const status = response.status;

        if (status == 200) {
            return json;
        }
        else {
            throwOpenSearchError(json)
        }
    } catch (error) {
        console.error(error)
        throw error
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

export async function searchRAG({ conversationId, input, prompt, model, indexName, pipelineName }: OpenSearchSearchParams) {
    try {
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

        const response = await sendRequest(`/${indexName}/_search?search_pipeline=${pipelineName}`, 'POST', data);

        const json = await response.json();

        const status = response.status;

        if (status == 200) {
            return json;
        }
        else {
            throwOpenSearchError(json)
        }

    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getInteractions(conversation_id: string, max_results: number, next_token: number) {
    try {
        const params = {
            max_results,
            next_token
        };

        const response = await getRequest('/_plugins/_ml/memory/conversation/' + conversation_id, params);

        const json = await response.json();

        const status = response.status;

        if (status == 200) {
            return json;
        }
        else {
            throwOpenSearchError(json)
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}