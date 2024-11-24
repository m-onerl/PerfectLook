export function addControls(canvas, object) {
  let isDragging = false;
  let startX, startY;

  canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
      const offsetX = event.clientX - startX;
      const offsetY = event.clientY - startY;
      startX = event.clientX;
      startY = event.clientY;

      object.rotation.x += offsetY * 0.01;
      object.rotation.y += offsetX * 0.01;
    }
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mouseleave", () => {
    isDragging = false;
  });
}
