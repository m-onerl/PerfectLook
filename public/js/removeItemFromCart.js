function removeItem(productName) {
  var amountToDelete = document.getElementById(
    "deleteamount_" + productName
  ).value;
  var endpoint =
    "/delete/" + encodeURIComponent(productName) + "/" + amountToDelete;
  window.location.href = endpoint;
}
