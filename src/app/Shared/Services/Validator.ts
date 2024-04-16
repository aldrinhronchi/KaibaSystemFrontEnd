import { ElementRef } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
/**
 * Valida se o input esta valido ou nao
 * retorna true caso seja valido e false caso seja invalido
 */
export function ValidateInput(
	Field: NgModel,
	Form: NgForm,
	divFormGroup: HTMLElement,
	specialValidation: string = "",
): Boolean {
	let validated: boolean = !(Field.errors != null && (Field.touched || Form.submitted));
	switch (specialValidation.toUpperCase()) {
		case "CPFORCNPJ":
			{
				validated = ValidateCNPJCPF(Field.value);
			}
			break;
		case "EMAIL":
			{
				validated = ValidateEmail(Field.value);
			}
			break;

		default:
			break;
	}
	ManipulateEM(validated, divFormGroup, specialValidation);

	return validated;
}
export function ValidateSelect(Field: NgModel, Form: NgForm, divFormGroup: HTMLElement): Boolean {
	let Validated = !(
		Field != null &&
		(Field.value == 0 || Field.value == "") &&
		(Field.touched || Form.submitted)
	);
	ManipulateEM(Validated, divFormGroup);
	return Validated;
}
export function ManipulateEM(
	condition: Boolean,
	divFormGroup: HTMLElement,
	specialValidation: string = "",
) {
	let tag: string = specialValidation !== "" ? specialValidation : "invalid";
	if (!condition) {
		let ems = divFormGroup.getElementsByTagName("em");
		if (ems.length == 0) {
			let em = document.createElement("em");
			let message = "";
			switch (specialValidation.toUpperCase()) {
				case "CPFORCNPJ":
					{
						message = "CPF/CNPJ Inválido!";
					}
					break;
				case "EMAIL":
					{
						message = "Email Inválido";
					}
					break;

				default:
					message = "Campo Obrigatório";
					break;
			}
			em.textContent = message;
			em.style.color = "#cc0000";
			em.classList.add(`auto-${tag}`);
			divFormGroup.appendChild(em);
		}
	} else {
		let ems = divFormGroup.getElementsByClassName(`auto-${tag}`);
		if (ems.length != 0) {
			for (let index = 0; index < ems.length; index++) {
				const element = ems[index];
				divFormGroup.removeChild(element);
			}
		}
	}
}
export function ValidateCNPJCPF(documento: string) {
	if ((documento ?? null) != null) {
		if (documento.trim().length == 0) {
			return true;
		}
		documento = documento.replace(/[^\d]/, "");

		if (documento.length >= 14) {
			if (!ValidateCNPJ(documento)) {
				return false;
			}
		} else if (documento.length >= 11) {
			if (!ValidateCPF(documento)) {
				return false;
			}
		}
	}

	return true;
}
export function ValidateCPF(documento: string): boolean {
	documento = documento.toString();
	// Remove caracteres inválidos do valor
	documento = documento.replace(/[^0-9]/g, "");
	let Soma;
	let Resto;
	Soma = 0;
	let DocInvalidos: string[] = [
		"00000000000",
		"11111111111",
		"22222222222",
		"33333333333",
		"44444444444",
		"55555555555",
		"66666666666",
		"77777777777",
		"88888888888",
		"99999999999",
	];
	if (DocInvalidos.includes(documento)) {
		return false;
	}
	for (let index = 1; index <= 9; index++) {
		Soma = Soma + parseInt(documento.substring(index - 1, index)) * (11 - index);
	}
	Resto = (Soma * 10) % 11;
	if (Resto == 10 || Resto == 11) {
		Resto = 0;
	}
	if (Resto != parseInt(documento.substring(9, 10))) {
		return false;
	}
	Soma = 0;
	for (let index = 1; index <= 10; index++) {
		Soma = Soma + parseInt(documento.substring(index - 1, index)) * (12 - index);
	}
	Resto = (Soma * 10) % 11;
	if (Resto == 10 || Resto == 11) {
		Resto = 0;
	}
	if (Resto != parseInt(documento.substring(10, 11))) {
		return false;
	}
	return true;
}
export function ValidateCNPJ(documento: string): boolean {
	documento = documento.replace(/[^\d]+/g, "");

	if (documento == "") {
		return false;
	}
	if (documento.length != 14) {
		return false;
	}
	let DocInvalidos: string[] = [
		"00000000000000",
		"11111111111111",
		"22222222222222",
		"33333333333333",
		"44444444444444",
		"55555555555555",
		"66666666666666",
		"77777777777777",
		"88888888888888",
		"99999999999999",
	];
	// Elimina CNPJs invalidos conhecidos
	if (DocInvalidos.includes(documento)) {
		return false;
	}
	// Valida DVs
	let tamanho = documento.length - 2;
	let numeros = documento.substring(0, tamanho);
	let digitos = documento.substring(tamanho);
	let soma = 0;
	let pos = tamanho - 7;
	for (let index = tamanho; index >= 1; index--) {
		soma += +numeros.charAt(tamanho - index) * pos--;
		if (pos < 2) {
			pos = 9;
		}
	}
	let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado != +digitos.charAt(0)) {
		return false;
	}

	tamanho = tamanho + 1;
	numeros = documento.substring(0, tamanho);
	soma = 0;
	pos = tamanho - 7;
	for (let index = tamanho; index >= 1; index--) {
		soma += +numeros.charAt(tamanho - index) * pos--;
		if (pos < 2) pos = 9;
	}
	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado != +digitos.charAt(1)) {
		return false;
	}
	return true;
}
export function ValidateEmail(email: string): boolean {
	if ((email ?? null) !== null) {
		if (email.trim().length == 0) {
			return true;
		}
	}
	let regexp = new RegExp(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	);
	return regexp.test(email);
}
