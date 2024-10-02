export const projects = [
  {
    image: "assets/img/project/pixel-saga.png",
    subtitle: "JasdAVA",
    title: "Pixel Saga Game",
  },
  {
    image: "assets/img/project/pixel-saga.png",
    subtitle: "JAVaasA",
    title: "Pixel Saga Game",
  },
  {
    image: "assets/img/project/pixel-saga.png",
    subtitle: "JAVAa",
    title: "Pixel Saga Game",
  },
  {
    image: "assets/img/project/pixel-saga.png",
    subtitle: "JAVA",
    title: "Pixel Saga Game",
  },
].sort((e1, e2) => {
  if (e1.subtitle === e2.subtitle) {
    return e1.title < e2.title ? -1 : 1;
  }
  return e1.subtitle < e2.subtitle ? -1 : 1;
});
