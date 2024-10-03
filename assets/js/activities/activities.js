export const activities = [
  {
    title: "JAVA",
    subtitle: "JAVA",
    background: "Blah Blah",
    image: [
      "assets/img/profile/my-profile.jpg",
      "assets/img/project/pixel-saga.png",
      "assets/img/profile/my-profile.jpg",
    ],
    preview_video: "./assets/videos/pixel-saga.mp4",
    tech_related: ["JAVA"],
    learn: ["AAA", "BBB"],
    contribution: "What I have done was Blah Blah",
    github: "https://github.com/BadLuckZ/Project-PixelSaga.git",
  },
].sort((e1, e2) => {
  if (e1.subtitle === e2.subtitle) {
    return e1.title < e2.title ? -1 : 1;
  }
  return e1.subtitle < e2.subtitle ? -1 : 1;
});
