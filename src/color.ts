import * as crypto from 'crypto';

const toHex = (decimal: number) => decimal.toString(16).padStart(2, '0');
const generateRandomColor = (seed: string) => {
  const md5 = crypto.createHash('md5');
  const hash = md5.update(seed).digest('hex');
  const r = parseInt(hash.substring(0, 2), 16);
  const g = parseInt(hash.substring(2, 4), 16);
  const b = parseInt(hash.substring(4, 6), 16);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const toDarkColor = (color: string) => {
  const changeColor0 = (code: number) => parseInt((code / 8 + 60).toString());
  const changeColor1 = (code: number) => parseInt((code / 8 + 48).toString());
  const changeColor2 = (code: number) => parseInt((code / 8 + 36).toString());
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  return [
    `#${toHex(changeColor0(r))}${toHex(changeColor0(g))}${toHex(changeColor0(b))}` + 'dd',
    `#${toHex(changeColor1(r))}${toHex(changeColor1(g))}${toHex(changeColor1(b))}` + 'aa',
    `#${toHex(changeColor2(r))}${toHex(changeColor2(g))}${toHex(changeColor2(b))}` + '33',
  ];
};

const toLightColor = (color: string) => {
  const changeColor0 = (code: number) => parseInt((255 - 60 - code / 8).toString());
  const changeColor1 = (code: number) => parseInt((255 - 48 - code / 8).toString());
  const changeColor2 = (code: number) => parseInt((255 - 36 - code / 8).toString());
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  return [
    `#${toHex(changeColor0(r))}${toHex(changeColor0(g))}${toHex(changeColor0(b))}` + 'dd',
    `#${toHex(changeColor1(r))}${toHex(changeColor1(g))}${toHex(changeColor1(b))}` + 'aa',
    `#${toHex(changeColor2(r))}${toHex(changeColor2(g))}${toHex(changeColor2(b))}` + '33',
  ];
};

export { generateRandomColor, toDarkColor, toLightColor };