function n(x: number) {
  return Math.floor(Math.random() * (1 + x));
}

export default function randomStr(len: number = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let str = "";
  for (let i = 0; i < len; i += 1) {
    const strPos = n(chars.length - 1);
    str += chars.charAt(strPos);
  }
  return str;
}