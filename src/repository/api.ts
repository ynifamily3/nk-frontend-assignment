export const upload = () => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({});
    }, Math.floor(Math.random() * 1000) + 1000);
  });
};
