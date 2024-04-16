import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { EnvironmentUrlService } from "../Services/environment-url.service";
import { Cargo } from "../../Models/Usuario/Cargo";
import { Usuario } from "../../Models/Usuario/Usuario";
import { PageMenu } from "../../Models/Views/PageMenu";
import { RequisicaoViewModel } from "../../Models/Views/RequisicaoViewModel";

@Injectable({
	providedIn: "root",
})
export class UserAPIService {
	constructor(private HTTP: HttpClient, private envUrl: EnvironmentUrlService) {}

	private CreateRoute = (route: string, envAddress: string) => {
		return `${envAddress}/${route}`;
	};
	public GetUsuarios = (
		page: number = 1,
		pagesize: number = 10,
		CamposQuery: string = "",
		ValoresQuery: string = "",
		Ordenacao: string = "",
		Ordem: boolean = false,
	) => {
		return this.HTTP.get<RequisicaoViewModel<Usuario>>(
			this.CreateRoute(
				`api/Usuario/ListarUsuarios?Pagina=${page}&RegistroPorPagina=${pagesize}&Campos=${CamposQuery}&Valores=${ValoresQuery}&Ordenacao=${Ordenacao}&Ordem=${Ordem}`,
				this.envUrl.urlAddress,
			),
		);
	};

	public SaveUsuario = (usuario: Usuario) => {
		return this.HTTP.post<boolean>(
			this.CreateRoute("api/Usuario/SalvarUsuario", this.envUrl.urlAddress),
			usuario,
		);
	};
	public DeleteUsuario = (IDUsuario: number) => {
		return this.HTTP.delete<boolean>(
			this.CreateRoute(`api/Usuario/ExcluirUsuario/${IDUsuario}`, this.envUrl.urlAddress),
		);
	};
	//#region  Cargos
	public GetCargos = (
		page: number = 1,
		pagesize: number = 10,
		CamposQuery: string = "",
		ValoresQuery: string = "",
		Ordenacao: string = "",
		Ordem: boolean = false,
	) => {
		return this.HTTP.get<RequisicaoViewModel<Cargo>>(
			this.CreateRoute(
				`api/Usuario/ListarCargos?Pagina=${page}&RegistroPorPagina=${pagesize}&Campos=${CamposQuery}&Valores=${ValoresQuery}&Ordenacao=${Ordenacao}&Ordem=${Ordem}`,
				this.envUrl.urlAddress,
			),
		);
	};

	public SaveCargo = (cargo: Cargo) => {
		return this.HTTP.post<any>(
			this.CreateRoute("api/Usuario/SalvarCargo/Cargo", this.envUrl.urlAddress),
			cargo,
		);
	};
	public DeleteCargo = (IDCargo: number) => {
		return this.HTTP.delete<boolean>(
			this.CreateRoute(`api/Usuario/ExcluirCargo/${IDCargo}`, this.envUrl.urlAddress),
		);
	};
	//#endregion
	//#region Permissoes
	public GetPermissoes = (IDCargo: number) => {
		return this.HTTP.get<PageMenu[]>(
			this.CreateRoute(`api/Usuario/ListarPermissoes?IDCargo=${IDCargo}`, this.envUrl.urlAddress),
		);
	};

	public SavePermissoes = (IDCargo: number, NovasPermissoesMenu: PageMenu[]) => {
		return this.HTTP.post<any>(
			this.CreateRoute(`api/Usuario/SalvarPermissoes?IDCargo=${IDCargo}`, this.envUrl.urlAddress),
			NovasPermissoesMenu,
		);
	};
	//#endregion
}
