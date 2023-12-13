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

export const validateFormCnpj = (_: any, value: string) => {
  if (!isValidCNPJ(value)) {
    return Promise.reject(
      t("input.invalid", {
        field: t(`input.cnpj`),
      }) || ""
    );
  }

  return Promise.resolve();
};
