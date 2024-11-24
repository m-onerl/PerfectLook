let currentIndex = 0;
let products = [];
let autoSlideInterval;

// Funkcja do załadowania losowych produktów
function loadRandomProducts() {
  fetch("/random")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      displayProduct(currentIndex);
      startAutoSlide();
    })
    .catch((error) => console.error("Error fetching random products:", error));
}

// Funkcja do wyświetlania produktu
function displayProduct(index) {
  const carouselInner = document.getElementById("carousel-inner");
  const product = products[index];
  const productItem = `
    <div class="carousel-item">
      <img src="/img/${product.img_file}" alt="${product.img_file}">
      <div class="right-size">
          <h1>${product.name}</h1>
          <h2 class="price">${product.price} ,-</h2>
          <p>${product.description}</p>
          <a class="medium-text" href="/product/${product.product_id}">Otwórz strone produktu <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.4034 16L9.09091 14.7045L14.4943 9.30114H0.5V7.42614H14.4943L9.09091 2.03977L10.4034 0.727273L18.0398 8.36364L10.4034 16Z" fill="black"/>
</svg>
</a>
      </div>
    </div>
  `;
  carouselInner.innerHTML = productItem;
}

// Funkcje do przewijania slajdów
function nextSlide() {
  currentIndex = (currentIndex + 1) % products.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + products.length) % products.length;
  updateCarousel();
}

function updateCarousel() {
  displayProduct(currentIndex);
}

// Funkcja do automatycznego przełączania slajdów
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 20000);
}

// Funkcja do zatrzymania automatycznego przełączania slajdów
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Załaduj produkty przy inicjalizacji
document.addEventListener("DOMContentLoaded", loadRandomProducts);
