export const serializeNumber = (value: number) => {
  return value.toString();
};

export const serializeCheckbox = (value: boolean) => {
  return value ? '1' : '0';
};

export const serializeDate = (value: Date) => {
  return value.toISOString();
};

export const serializePoint = (value: Array<number>) => {
  return value.join(',');
};
