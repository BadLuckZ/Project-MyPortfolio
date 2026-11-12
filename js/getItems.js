import { projects } from "./projects/project.js";
import { experiences } from "./experiences/experience.js";

const id = new URLSearchParams(location.search).get("id");
export const data = [...projects, ...experiences].find((i) => i.id === id);

if (!data) location.replace("index.html");
else document.title = `${data.title} | Thanagorn Chaiyut`;
