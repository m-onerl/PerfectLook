document.addEventListener("DOMContentLoaded", function() {
  const consentNotice = document.getElementById("consent-banner");
  const acceptConsentButton = document.getElementById("accept-button");

  if (!localStorage.getItem("consentAccepted")) {
    consentNotice.style.display = "flex";
  }

  acceptConsentButton.addEventListener("click", function() {
    localStorage.setItem("consentAccepted", "true");
    consentNotice.style.display = "none";
  });
});