export const activities = [
  {
    title: "Openhouse CU 2025",
    subtitle: "Frontend Developer",
    start_month: 2,
    start_year: 2025,
    background: `<b>Test.</b>
      <br><br>
      Test`,
    cover_image: "assets/img/activity/openhouse-cu-isd-2025/cover.jpg",
    images: [
      "assets/img/activity/openhouse-cu-isd-2025/content01.png",
      "assets/img/activity/openhouse-cu-isd-2025/content02.png",
      "assets/img/activity/openhouse-cu-isd-2025/content03.png",
      "assets/img/activity/openhouse-cu-isd-2025/content04.png",
      "assets/img/activity/openhouse-cu-isd-2025/content05.png",
      "assets/img/activity/openhouse-cu-isd-2025/content06.png",
      "assets/img/activity/openhouse-cu-isd-2025/content07.png",
      "assets/img/activity/openhouse-cu-isd-2025/content08.png",
      "assets/img/activity/openhouse-cu-isd-2025/content09.png",
      "assets/img/activity/openhouse-cu-isd-2025/content10.jpeg",
      "assets/img/activity/openhouse-cu-isd-2025/content11.png",
      "assets/img/activity/openhouse-cu-isd-2025/content12.jpeg",
      "assets/img/activity/openhouse-cu-isd-2025/content13.jpeg",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: false,
    preview_demo: "",
    have_doc: false,
    preview_doc: "",
    tech_related: ["Next.js", "TailwindCSS", "TypeScript"],
    learn: `There are ... things I can learn by participating in this project
      <br><br>
      <dd>
        1. <b>Test.</b>
        <br>
        Test. 
      </dd>
      <br>`,
    contribution: `<b>The main parts I contributed to this project are as follows</b>
      <br><br>
      <dd>
        1. <b>Test</b><br> Test.
      </dd>
      <br>
      Test.
      `,
  },
].sort((e1, e2) => {
  if (e1.start_year === e2.start_year) {
    return e1.start_year < e2.start_year ? 1 : -1;
  }
  if (e1.start_month === e2.start_month) {
    return e1.start_month < e2.start_month ? 1 : -1;
  }
  if (e1.subtitle === e2.subtitle) {
    return e1.title < e2.title ? -1 : 1;
  }
  return e1.subtitle < e2.subtitle ? -1 : 1;
});
