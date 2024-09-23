export const skills = [
  {
    id: 2,
    title: "Front End Developer",
    content: [
      { name: "HTML", ability: "Basics" },
      { name: "CSS", ability: "Basics" },
      { name: "JavaScript", ability: "Intermediate" },
    ],
  },
  {
    id: 1,
    title: "Coding Languages",
    content: [
      { name: "Python", ability: "Intermediate" },
      { name: "JAVA", ability: "Intermediate" },
      { name: "C++", ability: "Intermediate" },
    ],
  },
].sort((e1, e2) => {
  return e1.id < e2.id ? -1 : 1;
});
