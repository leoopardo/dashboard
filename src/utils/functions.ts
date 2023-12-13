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
