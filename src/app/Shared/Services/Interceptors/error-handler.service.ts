import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject, catchError, throwError } from "rxjs";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { AuthenticationService } from "../authentication.service";
import { ErrorInfo } from "../../../Models/Views/ErrorInfo";

@Injectable({
	providedIn: "root",
})
export class ErrorHandlerService implements HttpInterceptor {
	private errors = new Subject<string[]>();

	constructor(private router: Router, private authService: AuthenticationService) {}
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				let info = this.handleError(error);

				return throwError(info);
			}),
		);
	}

	private handleError = (error: HttpErrorResponse): ErrorInfo => {
		let Icon: SweetAlertIcon = "info";
		let Titulo: String = "Houve um erro!";
		switch (error.status) {
			case 400:
				Icon = "warning";
				Titulo = "";
				break;
			case 401:
				this.authService.Logoff();
				this.router.navigate(["/"]);
				break;

			case 404:
				return this.handleNotFound(error);
				break;
			default:
				Icon = "error";
		}
		let info: ErrorInfo = JSON.parse(JSON.stringify(error.error));

		Swal.fire({
			title: Titulo,
			text: info.Message,
			icon: Icon,
		});
		return info;
	};
	private handleNotFound = (error: HttpErrorResponse): ErrorInfo => {
		this.router.navigate(["/404"]);
		return JSON.parse(JSON.stringify(error.error));
	};
}
