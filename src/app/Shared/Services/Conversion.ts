export default class Conversion {
	//#region Geral
	/**
	 * Cria uma cópia do array, sem manter nenhuma referência ao arrey antigo ou
	 * elementos que sejam arrays/objetos.
	 */
	static ClonarArray = <T>(Dados: T[]): T[] => {
		const Resultado = [];

		for (const Elemento of Dados) {
			if (Array.isArray(Elemento)) {
				Resultado.push(Conversion.ClonarArray(Elemento));
			} else if (typeof Elemento === "object" && Elemento !== null) {
				Resultado.push(Conversion.ClonarObjeto(Elemento));
			} else {
				Resultado.push(Elemento);
			}
		}

		return Resultado as T[];
	};
	/**
	 * Cria uma cópia do objeto, sem manter nenhuma referência ao objeto antigo ou
	 * propriedades que sejam objetos.
	 * É preferível usar essa função invés de {@link EstenderObjeto} quando for
	 * apenas copiar valores.
	 */
	static ClonarObjeto = <T>(Dados: T): T => {
		const Resultado: any = {};

		let Elemento;
		for (const Chave in Dados) {
			Elemento = Dados[Chave];
			if (Array.isArray(Elemento)) {
				Resultado[Chave] = Conversion.ClonarArray(Elemento);
			} else if (typeof Elemento === "object" && Elemento !== null) {
				// Criando cópia (para não ser possível alterar objeto original)
				Resultado[Chave] = Conversion.ClonarObjeto(Elemento);
			} else {
				Resultado[Chave] = Elemento;
			}
		}

		return Resultado as T;
	};
	/**
	 * Returns the fist non-null value passed as argument, or null if all values are null;
	 */
	static Coalesce = <T>(...Values: T[]): T | null => {
		for (const Value of Values) {
			if (Value ?? null !== null) {
				return Value;
			}
		}

		return null;
	};
	/**
	 * Converte um valor para o tipo especificado, se possível.
	 */
	static Converter = <T>(Valor: any, Tipo: string): any => {
		switch (
			Tipo.toLowerCase() // BigInt
		) {
			case "bigint":
				return BigInt(Valor);
			case "boolean":
				return String(Valor) === "true";
			case "date":
				return new Date(Valor);
			case "float":
				return parseFloat(Valor);
			case "int":
				return parseInt(Valor, 10);
			case "number":
				return Number(Valor).valueOf();
			case "string":
			default:
				return Valor as T;
		}
	};
	/**
	 * Atualiza o objeto de Dados passado para a mesma estrutura do objeto de
	 * Padroes, adicionando chaves de Padroes que o objeto de Dados não tenha.
	 *
	 * Chaves do objeto de Dados que não existam no objeto Padroes são mantidas.
	 */
	static EstenderObjeto = <T>(Dados: Record<string, any>, Padroes: T): T => {
		// Prevenindo null|undefined
		const Resultado = Dados ?? {};

		let Element;
		for (const Chave in Padroes) {
			Element = Padroes[Chave];

			// Criando cópia (para não ser possível alterar Padroes)
			if (Array.isArray(Element)) {
				Resultado[Chave] = Resultado[Chave] ?? Conversion.ClonarArray(Element);
			} else if (typeof Element === "object" && Element !== null) {
				Dados[Chave] = Conversion.EstenderObjeto(Resultado[Chave], Element);
			} else {
				Resultado[Chave] = Resultado[Chave] ?? Element;
			}
		}

		return Resultado as T;
	};
	/**
	 * Cria um novo objeto, com todos os valores de *Dados* que estejam listados em
	 * *Campos*.
	 */
	static FiltrarObjeto = <T>(Dados: Record<string, any>, Campos: string[]): T => {
		let Resultado: any = {};

		for (const Campo of Campos) {
			if (Campo in Dados) {
				Resultado[Campo] = Dados[Campo];
			}
		}

		return Resultado as T;
	};
	/**
	 * Passa os parametros fornecidos para um objeto URLSearchParams, que pode ser
	 * usado como corpo numa requisição via fetch().
	 */
	static formUrlencoded = (
		Parametros?: string | string[][] | Record<string, string> | URLSearchParams,
	): URLSearchParams => {
		return new URLSearchParams(Parametros);
	};
	/**
	 * Cria uma cópia do objeto sem as chaves especificadas.
	 */
	static RemoverChaves = <T>(Objeto: T, Chaves: string | string[]): T => {
		if (!Array.isArray(Chaves)) {
			Chaves = [Chaves];
		}

		let Resultado: any = {
			...Objeto,
		};
		for (const Chave of Chaves) {
			delete Resultado[Chave];
		}

		return Resultado as T;
	};
	//#endregion

	//#region Date
	static FormatarData = (Data: Date | string, Opcoes?: Intl.DateTimeFormatOptions): string => {
		if (!(Data instanceof Date)) {
			Data = new Date(Data);
		}
		if (Opcoes ?? null === null) {
			Opcoes = undefined;
		}

		return new Intl.DateTimeFormat(
			Intl.DateTimeFormat().resolvedOptions().locale || "pt-BR",
			Opcoes,
		).format(Data);
	};
	/**
	 * Retorna somente a parte de data de uma string/data em formato ISO.
	 */
	static isoToDateString = (ISO: Date | String): string => {
		let Data;

		if (ISO instanceof Date) {
			Data = ISO;
		} else {
			Data = new Date(ISO as string);
		}

		return Data.toISOString().split("T")[0];
	};
	/**
	 * Retorna somente data e hora de uma string/data em formato ISO.
	 */
	static isoToDateTimeString = (ISO: Date | String): string => {
		let Data;

		if (ISO instanceof Date) {
			Data = ISO;
		} else {
			Data = new Date(ISO as string);
		}

		return Data.toISOString().replace(/(\.\d+)?Z$/gim, "");
	};
	//#endregion

	//#region Number
	static FormatarNumero = (Numero: number, Opcoes?: Intl.NumberFormatOptions): string => {
		if (isNaN(Numero)) {
			return "";
		} else {
			if (Opcoes ?? null === null) {
				Opcoes = undefined;
			}

			return new Intl.NumberFormat("en-US", Opcoes).format(Numero);
		}
	};
	//#endregion

	//#region String
	static CamelCase = (_String: string, Separator?: string): string => {
		if (Separator ?? "" === "") {
			Separator = " ";
		}

		if (_String ?? "" !== "") {
			return _String
				.split("_")
				.map(word => `${word[0].toUpperCase()}${word.substring(1)}`)
				.join("");
		} else {
			return "";
		}
	};
	/**
	 * Converte uma string binária em um ArrayBuffer (OctetStream).
	 * Versão aprimorada do código original (melhor legibilidade, maior desempenho).
	 *
	 * @see https://redstapler.co/sheetjs-tutorial-create-xlsx/
	 */
	static StringToArrayBuffer = (Data: string): ArrayBuffer => {
		const Length = Data.length;
		const Buffer = new ArrayBuffer(Length); //convert s to arrayBuffer
		const View = new Uint8Array(Buffer); //create uint8array as viewer

		for (let Index = 0; Index < Length; Index++) {
			View[Index] = Data.charCodeAt(Index) & 0xff; //convert to octet
		}

		return Buffer;
	};
	//#endregion
}
