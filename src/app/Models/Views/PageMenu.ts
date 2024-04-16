export interface PageMenu {
	Nome: string;
	Icone: string;
	Ordem: string;
	Paginas: Pagina[];
}
export interface Pagina {
	Nome: string;
	Url: string;
	Autorizacao: Autorizacao;
}
export interface Autorizacao {
	Criar: boolean;
	Revisar: boolean;
	Editar: boolean;
	Deletar: boolean;
}
