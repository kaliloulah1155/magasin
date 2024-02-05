export function removeFCFAAndSpaces(inputString: string): string {
  return inputString.replace(/F CFA|\s/g, "");
}
