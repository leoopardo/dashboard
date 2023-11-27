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