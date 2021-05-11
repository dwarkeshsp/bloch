import * as math from "mathjs";

export function complexToString(num) {
  let result = "";
  const re = math.abs(math.re(num)) > Number.EPSILON;
  const im = math.abs(math.im(num)) > Number.EPSILON;

  if (re && im)
    result += round(math.re(num)) + " + " + round(math.im(num)) + "i";
  else if (im)
    if (math.abs(math.im(num) - 1) < Number.EPSILON) result += "i";
    else result += round(math.im(num)) + "i";
  else result += round(math.re(num));

  return result;
}

export function round(num) {
  return (Math.round(num * 100) / 100).toString();
}
