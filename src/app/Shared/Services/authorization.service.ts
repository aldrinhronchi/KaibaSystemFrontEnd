import { Injectable } from "@angular/core";
import { Autorizacao, PageMenu } from "../../Models/Views/PageMenu";

@Injectable({
	providedIn: "root",
})
export class AuthorizationService {
	Menu?: PageMenu[] = undefined;
	constructor() {
		this.LoadMenu();
	}
	public LoadMenu = (): boolean => {
		const Menu = localStorage.getItem("Menu");
		if (Menu != null) {
			this.Menu = JSON.parse(Menu);
			return true;
		}
		return false;
	};
	public GetAuthorization = (Nome: string): Autorizacao => {
		let Auth: Autorizacao = {
			Criar: false,
			Revisar: false,
			Editar: false,
			Deletar: false,
		};
		if ((this.Menu ?? null) == null) {
			if (!this.LoadMenu()) {
				// Await
				if (!this.LoadMenu()) {
					// Await
					if ((this.Menu ?? null) == null && !this.LoadMenu()) {
						return Auth;
					}
				}
			}
		}
		/* FOR DA SACANAGEM FUNCIONAL SO PRA ENTENDER O CODIGO DE BAIXO
			for (let index = 0; index < this.Menu!.length; index++) {
				const element = this.Menu![index];
				const Paginas = element.Paginas;
				for (let jindex = 0; jindex < Paginas.length; jindex++) {
					const Pagina = Paginas[jindex];
					if (Pagina.Nome == Nome) {
						Auth = Pagina.Autorizacao;
					}
				}
			}*/
		(this.Menu || []).some(menuElement => {
			const pagina = menuElement.Paginas.find(x => x.Nome === Nome);
			if (pagina) {
				Auth = pagina.Autorizacao;
				return true;
			}
			return false;
		});

		return Auth;
	};
}
