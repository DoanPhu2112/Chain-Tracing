import {
  NumeralThousandGroupStyles,
  formatNumeral as czFormatNumeral,
  unformatNumeral as czUnformatNumeral,
} from "cleave-zen";

export function formatNumeral(value: string, decimalScale = 0, positiveOnly = true) {
  return czFormatNumeral(value, {
    numeralThousandsGroupStyle: NumeralThousandGroupStyles.THOUSAND,
    numeralDecimalScale: decimalScale,
    numeralPositiveOnly: positiveOnly,
  });
}

export function unformatNumeral(value: string) {
  return czUnformatNumeral(value, { numeralDecimalMark: "." });
}
