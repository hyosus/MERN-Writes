export const sevenDaysFromNow = () => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

export const thirtyDaysFromNow = () => {
  return new Date(now + 30 * 24 * 60 * 60 * 1000);
};

export const fiveMinutesAgo = () => {
  return new Date(Date.now() - 5 * 60 * 1000);
};

export const oneHourFromNow = () => {
  return new Date(Date.now() + 60 * 60 * 1000);
};
