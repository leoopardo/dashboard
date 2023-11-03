export const getPercent = (value: number, total: number) => {
    const fee =
      (value * 100) / (total || 0);
    if (value === 0) return '0%';
    return `${fee.toFixed(2) || 0}%`;
  };