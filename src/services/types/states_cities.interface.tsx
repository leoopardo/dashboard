export interface StateItem {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface CityItem {
  id: number;
  nome: string;
  municipio: {
    id: number;
    nome: string;
    microrregiao: {
      id: number;
      nome: string;
      mesorregiao: {
        id: number;
        nome: string;
        UF: {
          id: number;
          sigla: string;
          nome: string;
          regiao: {
            id: number;
            sigla: string;
            nome: string;
          };
        };
      };
    };
    "regiao-imediata": {
      id: number;
      nome: string;
      "regiao-intermediaria": {
        id: number;
        nome: string;
        UF: {
          id: number;
          sigla: string;
          nome: string;
          regiao: {
            id: number;
            sigla: string;
            nome: string;
          };
        };
      };
    };
  };
}

export interface CountryInterface {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  currencies: {
    JOD: {
      name: string;
      symbol: string;
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  postalCode: {
    format: string;
    regex: string;
  };
  translations: {
    por: {
      official: string;
      common: string;
    };
  };
}
