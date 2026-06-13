import { experiences } from "./experience.js";
import { renderCards } from "../renderCards.js";

renderCards(experiences, {
  sectionId: "experience",
  counterId: "my-experience-number",
  cardboxClass: "experience-cardbox",
  containerClass: "experience-container",
});
