import { isValidCNPJ } from "@brazilian-utils/brazilian-utils";
import { t } from "i18next";

export function unmask(value: string): string {
    return value.replace(/[^\d]/g, "");
}

export function formatCPF(cpf: string | '') {
    const cleanedCPF = cpf?.replace(/\D/g, '');
    if (!cleanedCPF || cleanedCPF.length !== 11) {
      return '-';
    }
  
    return cleanedCPF?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(CNPJ: string | '') {
  const cleanedCNPJ = CNPJ?.replace(/\D/g, '');
  if (!cleanedCNPJ || cleanedCNPJ.length !== 14) {
    return '-';
  }

  return cleanedCNPJ?.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
}

export const setFirstChildDivId = (tabIndex: Element | null, id: string): void => {
  if (tabIndex) {
    const firstChildDiv = tabIndex.querySelector('div');

    if (firstChildDiv) {
      firstChildDiv.setAttribute('id', id);
    }
  }
};

export const setFirstChildDivTestId = (tabIndex: Element | null, id: string): void => {
  if (tabIndex) {
    const firstChildDiv = tabIndex.querySelector('div');
    if (firstChildDiv) {
      firstChildDiv.setAttribute('data-test-id', id);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateFormCnpj = (_: any, value: string) => {
  if (value && !isValidCNPJ(value)) {
    return Promise.reject(
      t("input.invalid", {
        field: t(`input.cnpj`),
      }) || ""
    );
  }

  return Promise.resolve();
};
