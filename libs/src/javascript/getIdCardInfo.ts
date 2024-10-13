import { isIdCardregexp } from '@/constants/regexp';

const getIdCardInfo = (idCard: string, separator = '/') => {
  if (!isIdCardregexp.test(idCard)) {
    throw Error(`${idCard}不是一个身份证号码`);
  }
  // 提取 idCard 中的字符
  const idSubstr = (s: number, e: number) => idCard.substr(s, e);
  // 拼接日期
  const splice = (d: string[]) => d.join(separator);
  // 获取出生年月日 性别（0 女 1 男）
  let birthday, gender;
  if (idCard.length === 18) {
    birthday = splice([idSubstr(6, 4), idSubstr(10, 2), idSubstr(12, 2)]);
    gender = Number(idSubstr(-2, 1)) & 1;
  } else {
    birthday = splice([idSubstr(6, 2), idSubstr(8, 2), idSubstr(10, 2)]);
    gender = Number(idSubstr(-1, 1)) & 1;
  }
  // 获取年龄（实岁）
  const birthDate = new Date(birthday);
  const newDate = new Date();
  const year = newDate.getFullYear();
  let age = year - birthDate.getFullYear();
  if (newDate < new Date(splice([String(year), birthday.substring(5)]))) {
    age--;
  }
  return {
    age,
    birthday,
    gender,
  };
};

export default getIdCardInfo;
