export interface Cargo {
	ID: number;
	Nome: string;
	Ativo: boolean;
	DataCriado: Date;
	DataAlterado?: Date;
	UsuarioCriado?: string;
	UsuarioAlterado?: string;
}
