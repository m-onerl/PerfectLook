import bookcaseParams from "./templates/bookcase/params.json" with {
  type: "json",
};

export function getDefaultParams(furniture) {
  switch (furniture) {
    case "bookcase":
      return {
        shelfWidth: bookcaseParams.shelfWidth.default,
        shelvesWidth: bookcaseParams.shelvesWidth.default,
        shelfDepth: bookcaseParams.shelfDepth.default,
        minRequiredShelvHeight: bookcaseParams.minRequiredShelvHeight.default,
        shelfHeight: bookcaseParams.shelfHeight.default,
        color: bookcaseParams.color,
      };
    default:
      return {};
  }
}
