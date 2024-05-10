export function moneyFormat(x: string): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
  