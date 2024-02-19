export function moneyFormatter(value: number) {
  if (`${value}`.includes("e-")) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(0); // Retorna "0,00" se for notação científica
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(
    value
      ? `${value}`.split(".")[1]
        ? +`${`${value}`.split(".")[0]}.${`${value}`
            ?.split(".")[1]
            ?.substring(0, 2)}` //remove todos as casas decimais depois da segunda
        : value
      : 0
  );
}
