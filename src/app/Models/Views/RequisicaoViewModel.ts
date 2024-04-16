export interface RequisicaoViewModel<T> {
	Data: T[];
	Type: string;
	Page?: number;
	PageSize?: number;
	PageCount?: number;
	Status?: string;
}
export interface OpcoesPagina {
	page?: number;
	size?: number;
	count?: number;
}
