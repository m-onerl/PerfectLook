import { getParamsHTML } from "./params.js";

export function addGUI(params, updateObject) {
  const formContainer = document.getElementById("gui");
  formContainer.innerHTML += getParamsHTML(params);

  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");
  const depthInput = document.getElementById("depth");
  const shelvesWidthInput = document.getElementById("shelvesWidth");
  const minRequiredHeightInput = document.getElementById("minRequiredHeight");

  // Set initial values from params
  widthInput.value = params.shelfWidth;
  heightInput.value = params.shelfHeight;
  depthInput.value = params.shelfDepth;
  shelvesWidthInput.value = params.shelvesWidth;
  minRequiredHeightInput.value = params.minRequiredShelvHeight;

  // Add event listeners for input changes and updateObject call
  widthInput.addEventListener("input", (e) => {
    console.log(e);
    params.shelfWidth = parseFloat(e.target.value);
    updateObject();
  });

  heightInput.addEventListener("input", (e) => {
    params.shelfHeight = parseFloat(e.target.value);
    updateObject();
  });

  depthInput.addEventListener("input", (e) => {
    params.shelfDepth = parseFloat(e.target.value);
    updateObject();
  });

  shelvesWidthInput.addEventListener("input", (e) => {
    params.shelvesWidth = parseFloat(e.target.value);
    updateObject();
  });

  minRequiredHeightInput.addEventListener("input", (e) => {
    params.minRequiredShelvHeight = parseFloat(e.target.value);
    updateObject();
  });
}
