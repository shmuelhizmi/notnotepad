export const getDocumentLanguage = name => {
  return name.slice(name.indexOf(".") + 1, name.lenght);
};
