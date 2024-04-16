import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { LoginViewModel } from "../../Models/Views/LoginViewModel";
import { PageMenu } from "../../Models/Views/PageMenu";
import { Subject } from "rxjs";
import { EnvironmentUrlService } from "./environment-url.service";
import { Usuario } from "../../Models/Usuario/Usuario";
import { RequisicaoViewModel } from "../../Models/Views/RequisicaoViewModel";

@Injectable({
	providedIn: "root",
})
export class AuthenticationService {
	private authChangeSub = new Subject<boolean>();
	public authChanged = this.authChangeSub.asObservable();

	constructor(private HTTP: HttpClient, private envUrl: EnvironmentUrlService) {}
	public registerUser = (route: string, body: Usuario) => {
		return this.HTTP.post<RequisicaoViewModel<Usuario>>(
			this.CreateRoute(route, this.envUrl.urlAddress),
			body,
		);
	};
	public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
		this.authChangeSub.next(isAuthenticated);
	};
	private CreateRoute = (route: string, envAddress: string) => {
		return `${envAddress}/${route}`;
	};
	public LoginUser = (route: string, body: LoginViewModel) => {
		return this.HTTP.post<RequisicaoViewModel<Usuario>>(
			this.CreateRoute(route, this.envUrl.urlAddress),
			body,
		);
	};
	public Logoff = () => {
		localStorage.removeItem("Token");
		localStorage.removeItem("User");
		localStorage.removeItem("Menu");
		this.sendAuthStateChangeNotification(false);
	};
}
