// Load amount from billing page and round up
let rawAmount = parseFloat(localStorage.getItem("amount") || "0");
let roundedAmount = Math.ceil(rawAmount);
document.getElementById("amount").textContent = roundedAmount.toFixed(2);

// Payment handler
document.getElementById("paymentForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("✅ Payment Successful! Thank you for your purchase 🎶");
  localStorage.clear();
  window.location.href = "billing.html";
});
