import { createBookcase } from "./templates/bookcase/bookcase.js";

export function createObject(furniture) {
  switch (furniture) {
    case "bookcase":
      return createBookcase;
  }
}
