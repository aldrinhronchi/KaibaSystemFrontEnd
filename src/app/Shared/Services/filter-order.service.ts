import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { ColumnViewModel } from "../../Models/Views/ColumnViewModel";
import Conversion from "./Conversion";

@Injectable({
	providedIn: "root",
})
export class FilterOrderService {
	Colunas: ColumnViewModel[] = [];
	ColunasFiltradas: ColumnViewModel[] = [];
	RefreshList: any;

	constructor(private router: Router) {}
	SetParams = (
		Colunas: ColumnViewModel[],
		ColunasFiltradas: ColumnViewModel[],
		RefreshList: any,
	) => {
		this.Colunas = Colunas;
		this.ColunasFiltradas = ColunasFiltradas;
		this.RefreshList = RefreshList;
	};
	Filter = (Coluna: ColumnViewModel) => {
		let Col = Conversion.ClonarObjeto<ColumnViewModel>(Coluna);
		switch (Col.Tipo) {
			case "checkbox":
				if (Col.Valor == "") {
					Col.Valor = "false";
				}
				break;
			case "date":
				let DataArray = Col.Valor.split("-");
				//ano-mes-dia
				Col.Valor = `${DataArray[2]}/${DataArray[1]}/${DataArray[0]}`;
				break;
		}
		let Filtrado = this.ColunasFiltradas.find(x => x.Nome == Col.Nome);
		if ((Filtrado ?? null) != null) {
			if (Col.Valor == "") {
				this.ColunasFiltradas = this.ColunasFiltradas.filter(x => x.Nome !== Col.Nome);
			} else {
				Filtrado!.Valor = Col.Valor;
			}
		} else {
			this.ColunasFiltradas.push(Col);
		}

		this.UpdateValueFilter();
	};
	ChangeBooleanFilterColumn = (Valor: any, NomeColuna: string): boolean => {
		let Coluna = this.Colunas.find(x => x.Nome == NomeColuna);
		if ((Coluna ?? null) != null) {
			Coluna!.Valor = Valor.checked.toString();
		}
		return Valor.checked;
	};
	UpdateValueFilter = () => {
		let Valores = "";
		let Campos = "";
		for (const Filtros of this.ColunasFiltradas) {
			if (Campos != "") {
				Campos = `${Campos};|;${Filtros.Campo}`;
				Valores = `${Valores};|;${Filtros.Valor}`;
			} else {
				Campos = Filtros.Campo;
				Valores = Filtros.Valor;
			}
		}
		const navigationExtras: NavigationExtras = {
			queryParams: { Campos: Campos, Valores: Valores },
			queryParamsHandling: "merge",
		};

		this.router.navigate([], navigationExtras);
		setTimeout(() => {
			this.RefreshList();
		}, 500);
	};
	RemoveValueFilter = () => {
		const navigationExtras: NavigationExtras = {
			queryParams: { Campos: null, Valores: null, Ordenacao: null, Ordem: null },
			queryParamsHandling: "merge",
		};

		this.router.navigate([], navigationExtras);
		setTimeout(() => {
			this.RefreshList();
		}, 500);
	};
	OrderBy = (Coluna: ColumnViewModel) => {
		const navigationExtras: NavigationExtras = {
			queryParams: { Ordenacao: Coluna.Campo, Ordem: Coluna.Ordem },
			queryParamsHandling: "merge",
		};

		this.router.navigate([], navigationExtras);
		setTimeout(() => {
			this.RefreshList();
		}, 500);
	};
}
