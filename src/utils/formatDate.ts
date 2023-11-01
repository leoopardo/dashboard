export const formatFilterDate = (string: string) => {
  const year = string.slice(0, 4);
  const month = string.slice(4, 6);
  const day = string.slice(6, 8);
  const hour = string.slice(8, 10);

  const formatedDate = `${day}-${month}-${year} ${hour ? `${hour}:00:00` : ""}`;

  return formatedDate;
};
