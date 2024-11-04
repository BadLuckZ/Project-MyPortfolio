export const skills = [
  {
    id: 2,
    title: "Front End Developer",
    content: [
      { name: "HTML", ability: "Basic" },
      { name: "CSS", ability: "Basic" },
      { name: "JavaScript", ability: "Intermediate" },
      { name: "React", ability: "Basic" },
    ],
  },
  {
    id: 1,
    title: "Coding Languages",
    content: [
      { name: "Python", ability: "Intermediate" },
      { name: "Java", ability: "Intermediate" },
      { name: "JavaScript", ability: "Intermediate" },
      { name: "C++", ability: "Intermediate" },
    ],
  },
].sort((e1, e2) => {
  return e1.id < e2.id ? -1 : 1;
});

let max_num_content = 0;

for (let skill of skills) {
  if (skill.content.length > max_num_content) {
    max_num_content = skill.content.length;
  }
}

export default max_num_content;
