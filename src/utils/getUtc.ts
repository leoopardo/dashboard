export function getUtcOffset() {
    const currentDate = new Date();
    const offsetInMinutes = currentDate.getTimezoneOffset();
    const offsetInHours = offsetInMinutes / 60;
    return -offsetInHours; // Retorna negativo pois estamos representando o UTC em relação ao fuso horário local
  }