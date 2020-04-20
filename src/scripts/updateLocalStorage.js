export const updateLocalStorage = obj => {
  const currentData = JSON.parse(localStorage.getItem("newTabExtensionData"));
  localStorage.setItem(
    "newTabExtensionData",
    JSON.stringify({ ...currentData, ...obj })
  );
};

export const readLocalStorage = key => {
  const data = JSON.parse(localStorage.getItem("newTabExtensionData"))
  if (data) {
    return data[key] || false
  } else {
    return false
  }
}

export const removeLocalStorage = key => {
  const data = JSON.parse(localStorage.getItem("newTabExtensionData"))
  try {
    delete data[key]
  } catch (e) {

  } finally {
    localStorage.setItem(
      "newTabExtensionData",
      JSON.stringify(data)
    );
  }
}
