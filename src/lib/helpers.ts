export const atomicDir = (file: string) => {
  const filePath = file.split("/");
  const type = filePath.slice(filePath.length - 3, filePath.length - 2)[0];
  return type;
};
