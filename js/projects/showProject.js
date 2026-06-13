import { projects } from "./project.js";
import { renderCards } from "../renderCards.js";

renderCards(projects, {
  sectionId: "project",
  counterId: "my-project-number",
  cardboxClass: "project-cardbox",
  containerClass: "project-container",
});
