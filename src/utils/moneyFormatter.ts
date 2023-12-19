function truncateNumber(num: number) {
  const [int, dec] = num.toString().split(".");
  return parseFloat(int + "." + (dec || "").slice(0, 2));
}

export function moneyFormatter(value: number) {
  const number = truncateNumber(value);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
}
