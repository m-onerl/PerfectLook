import { addGUI as BookcaseGUI } from "./templates/bookcase/gui.js";

export function getGUIFunction(furniture) {
  switch (furniture) {
    case "bookcase":
      return BookcaseGUI;
    default:
      return {};
  }
}
