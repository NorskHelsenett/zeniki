export interface NAMResponse<T> {
    readonly count: number;
    results: T[] | [];
}