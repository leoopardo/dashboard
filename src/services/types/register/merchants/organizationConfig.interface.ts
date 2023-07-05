export interface IOrganizationConfig {
    cpf_api_permission: boolean;
}

export interface IOrganizationUpdateConfig {
    merchant_id?: number;
    cpf_api_permission?: boolean
    status?: boolean
}

export interface IOrganizationConfigResponse {
    id?: number;
    merchantConfig?: IOrganizationConfig
    cpf_api_permission?: boolean
    status?: boolean
}