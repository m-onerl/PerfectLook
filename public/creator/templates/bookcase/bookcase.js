export function createBookcase(inputParams) {
  function scaleParams(params, scale) {
    const scaledParams = {};
    for (const key in params) {
      if (params.hasOwnProperty(key) && typeof params[key] === "number") {
        scaledParams[key] = params[key] / scale;
      } else {
        scaledParams[key] = params[key];
      }
    }
    return scaledParams;
  }

  // Funkcja tworząca półkę (BoxGeometry)
  function createShelf(width, height, depth, color, x, y, z) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const shelf = new THREE.Mesh(geometry, material);
    shelf.position.set(x, y, z);
    shelf.castShadow = true;
    return shelf;
  }

  // Funkcja obliczająca liczbę półek
  function calculateNumShelves(minHeight, shelfHeight, shelfSpacing) {
    return Math.max(1, Math.floor(minHeight / (shelfHeight + shelfSpacing)));
  }

  function createBookcase(params) {
    const bookcase = new THREE.Group();

    const {
      shelfWidth,
      shelvesWidth,
      shelfDepth,
      minRequiredShelvHeight,
      shelfHeight,
      color,
    } = params;

    const numShelves = calculateNumShelves(
      shelfHeight,
      shelvesWidth,
      minRequiredShelvHeight,
    );

    // Tworzenie półek
    for (let i = 0; i < numShelves; i++) {
      const y = i * minRequiredShelvHeight;
      const shelf = createShelf(
        shelfWidth,
        shelvesWidth,
        shelfDepth,
        color,
        0,
        y,
        0,
      );
      bookcase.add(shelf);
    }

    // Tworzenie boków regału
    const sideWidth = 0.3;
    const sideHeight = (numShelves - 1) * minRequiredShelvHeight + shelvesWidth;
    const sideDepth = shelfDepth;

    const leftSide = createShelf(
      sideWidth,
      sideHeight,
      sideDepth,
      color,
      -shelfWidth / 2 + sideWidth / 2,
      sideHeight / 2 - shelvesWidth / 2,
      0,
    );
    const rightSide = createShelf(
      sideWidth,
      sideHeight,
      sideDepth,
      color,
      shelfWidth / 2 - sideWidth / 2,
      sideHeight / 2 - shelvesWidth / 2,
      0,
    );

    bookcase.add(leftSide);
    bookcase.add(rightSide);

    return bookcase;
  }

  // Skalowanie params
  const scaledParams = scaleParams(inputParams, 16);

  // Tworzenie regału
  return createBookcase(scaledParams);
}
