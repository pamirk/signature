import {NormalizedEntity} from "./Common";

export type ApiKeyCreatePayload = {
    name?: string;
    prefix?: string;
}

export interface ApiKeysGetPayload {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    deleted?: boolean;
}

export interface ApiKey {
    id?: string
    requests?: string
    deletedAt?: string
    name?: string
    prefix?: string
    createdAt?: string
}

export interface ApiKeyIdPayload {
    apiKeyId: string;
}

export interface ApiKeysData {
    items?: ApiKey[];
    apiKeys: NormalizedEntity<ApiKey>;
    paginationData: {
        totalItems: any;
        pageCount: any;
        itemsCount: any;
    }
    // totalItems : number;
    // totalPages: number;
    // itemCount: number;
}

export interface ApiKeyCreateResult {
    name?: string;
    key?: string;

}