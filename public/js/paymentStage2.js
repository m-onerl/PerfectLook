document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const paymentFields = document.getElementById("paymentFields");
    paymentFields.innerHTML = "";

    if (radio.value === "blik") {
      paymentFields.innerHTML = `
            <label for="blikCode">BLIK Code:</label>
            <input type="text" id="blikCode" name="blikCode" required>
          `;
    } else if (radio.value === "creditCard") {
      paymentFields.innerHTML = `
            <label for="creditCardNumber">Wprowadz dane karty:</label>
            <input type="text" id="creditCardNumber" name="creditCardNumber" placeholder="Numer karty krerydtowej" required>

            <div>
              <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
              <input type="text" id="cvv" name="cvv" placeholder="CVV" required>
            </div>
          `;
    }
  });
});

document
  .getElementById("paymentForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).value;
    let paymentSuccess = false;

    if (paymentMethod === "blik") {
      const blikCode = document.getElementById("blikCode").value.trim();
      if (blikCode.length === 6 && !isNaN(blikCode)) {
        paymentSuccess = true;
      }
    } else if (paymentMethod === "creditCard") {
      const creditCardNumber = document
        .getElementById("creditCardNumber")
        .value.trim();
      const expiryDate = document.getElementById("expiryDate").value.trim();
      const cvv = document.getElementById("cvv").value.trim();
      if (
        creditCardNumber.length === 16 &&
        !isNaN(creditCardNumber) &&
        expiryDate.length === 5 &&
        cvv.length === 3 &&
        !isNaN(cvv)
      ) {
        paymentSuccess = true;
      }
    }

    if (paymentSuccess) {
      try {
        const response = await fetch("/clear-cart", { method: "POST" }); // użyj await, aby poczekać na zakończenie żądania fetch
        const data = await response.text(); // użyj await, aby poczekać na zakończenie odczytu odpowiedzi jako tekstu
        alert(data);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Wprowadź poprawne dane płatności");
    }
  });
