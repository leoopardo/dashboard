export function unmask(value: string): string {
    // Remove any non-digit characters from the value
    return value.replace(/[^\d]/g, "");
}