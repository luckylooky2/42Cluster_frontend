export const getDashboardUidFromUrl = function () {
  const DEV = 2,
    PROD = 3;

  return window.location.pathname.split('/')[DEV];
};
