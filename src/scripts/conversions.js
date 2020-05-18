export const tempConvert = (temp, unit) => {
  if (unit === "us") {
    return Math.round((temp * 9) / 5 + 32);
  } else {
    return Math.round(temp);
  }
};

export const speedConvert = (speed, unit) => {
  if (unit === "us") {
    return `${Math.round(speed * 2.23694)} mph`;
  } else {
    return `${Math.round(speed)} m/s`;
  }
};
