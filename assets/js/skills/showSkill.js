import { skills } from "./skill.js";

const skill_section = document.getElementById("skill");

skills.forEach((skill) => {
  const skill_area = document.createElement("div");
  skill_area.classList.add("skills-area");

  const skills_title = document.createElement("h2");
  skills_title.classList.add("skills-title");
  skills_title.innerText = skill.title;

  const skill_box = document.createElement("div");
  skill_box.classList.add("skills-box");
  skill.content.forEach((s) => {
    const skill_data = document.createElement("div");
    skill_data.classList.add("skill-data");
    skill_data.innerHTML = `
        <i class="fa-regular fa-circle-check"></i>
        <div>
            <h3 class="skill-name">${s.name}</h3>
            <p class="skill-description">${s.ability}</p>
        </div>
    `;
    skill_box.appendChild(skill_data);
  });

  skill_area.appendChild(skills_title);
  skill_area.appendChild(skill_box);
  skill_section.appendChild(skill_area);
});
