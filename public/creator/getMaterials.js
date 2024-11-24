export function fetchMaterials() {
  fetch("/get_materials")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error("Error fetching random products:", error));
}
