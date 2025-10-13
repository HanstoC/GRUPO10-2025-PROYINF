export type ApiResponse<T> = {
    data: T;
    message: string;
    metadata: string;
};

export interface ApiErrorBody {
    error: string;
    status?: number;
}