export const upload = async (progressFn: (progress: number) => void) => {
  let progress = -1;
  return new Promise((resolve) => {
    const id = window.setInterval(() => {
      // between 1 ~ 10
      progress += Math.floor(Math.random() * 10) + 1;
      progressFn(progress);
      if (progress > 100) {
        progress = 100;
      }
      if (progress >= 100) {
        window.clearInterval(id);
        resolve({});
      }
    }, 100);
  });
};
