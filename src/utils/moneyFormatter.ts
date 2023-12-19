function truncarNumero(num: number) {
  const [inteiro, decimal] = num.toString().split(".");
  return parseFloat(inteiro + "." + (decimal || "").slice(0, 2));
}

export function moneyFormatter(value: number) {
  const number = truncarNumero(value);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
}
