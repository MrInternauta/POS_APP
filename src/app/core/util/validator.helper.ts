export const isNumber = (string: string): boolean => /^[0-9]+$/.test(string);

export const isLetter = (string: string): boolean => /^[a-zA-Z]*$/.test(string);

export const isEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const ValidLength = (string: string, length: number): boolean =>
  String(string).length <= length;
