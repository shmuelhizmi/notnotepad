export const getDocumentLanguage = name => {
  const parts = name.split("/");
  const last = parts[parts.length - 1];
  if (last.includes(".")) {
    return last.slice(last.lastIndexOf(".") + 1, last.length);
  }
  return "none";
};
