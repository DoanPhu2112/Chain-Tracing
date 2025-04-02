export function cropNumber(num: number, numAfter: number = 3, symbol: string = '') {
  // Convert to string to handle large numbers
  if (num == 0) return "<0.0001" + symbol;
  if (num < 0.01 && numAfter <= 3) return "<0.01" + symbol;
  
  let strNum = num.toString();
  
  // Split into integer and decimal parts
  let [intPart, decPart] = strNum.split('.');
  
  // Format integer part with commas
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // If there's a decimal part
  if (decPart) {
      // Truncate decimal part to the specified number of places
      decPart = decPart.slice(0, numAfter);
      
      // Remove trailing zeros from decimal part
      decPart = decPart.replace(/0+$/, '');

      // If the decimal part becomes empty after removing zeros, return just the integer part
      if (decPart === '') {
          return intPart + symbol;
      }

      return `${intPart},${decPart}${symbol}`;
  }
  return Number.isNaN(Number(num)) ? "Unavailable" : (intPart  + symbol);
}
