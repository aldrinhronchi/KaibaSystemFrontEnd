import {
	HttpEvent,
	HttpHandler,
	HttpHeaders,
	HttpInterceptor,
	HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/enviroment";

@Injectable({
	providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
	constructor(private router: Router) {}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = localStorage.getItem("Token");
		const isApiUrl = request.url.startsWith(environment.urlAddress);
		if (token != null && isApiUrl) {
			request = request.clone({
				setHeaders: { Authorization: `Bearer ${token}` },
			});
		} else if (isApiUrl && !request.url.endsWith("api/Usuario/Autenticar")) {
			this.router.navigate(["/"]);
		}
		return next.handle(request);
	}
}
