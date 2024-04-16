import { Cargo } from "./Cargo";

export interface Usuario {
	ID: number;
	Nome: string;
	Login?: string;
	Senha?: string;
	Email: string;
	Cargo?: Cargo;
	IDCargo: number;
	Ativo: boolean;
	DataCriado: Date;
	DataAlterado?: Date;
	UsuarioCriado?: string;
	UsuarioAlterado?: string;
	Token?: string;
}
