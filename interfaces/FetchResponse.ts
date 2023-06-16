export default interface IFetchResponse {
	status: number;
	statusText: string;
	ok: boolean;
	headers: Headers;
	clone(): IFetchResponse;
	text(): Promise<string>;
	json<T = any>(): Promise<T>;
	blob(): Promise<Blob>;
	formData(): Promise<FormData>;
}
