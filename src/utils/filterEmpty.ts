export const filterEmpty = (str: string) => {
  if (typeof str !== 'string') return str;
  let res = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== ' ') {
      res += str[i];
    }
  }
  return res;
};
