export function moneyFormatter(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(
    value
      ? `${value}`.split(".")[1]
        ? +`${`${value}`.split(".")[0]}.${`${value}`
            ?.split(".")[1]
            ?.substring(0, 2)}`
        : value
      : 0
  );
}
