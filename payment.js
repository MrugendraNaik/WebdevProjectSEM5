const planData = {
  discovery: { name: 'Discovery', monthly: 0, yearly: 0 },
  harmony: { name: 'Harmony', monthly: 149, yearly: 1341 },
  symphony: { name: 'Symphony', monthly: 249, yearly: 2241 }
};

let currentPlan = 'harmony';
let currentBilling = 'monthly';
let currentPrice = 149;
let originalPrice = 149;
let promoApplied = false;

function getSelectedPlan() {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPlan = urlParams.get('plan') || 'harmony';
  currentPlan = planData[selectedPlan] ? selectedPlan : 'harmony';
  currentBilling = 'monthly';
  currentPrice = planData[currentPlan].monthly;
  originalPrice = currentPrice;

  document.getElementById('planName').textContent = planData[currentPlan].name;
  document.getElementById('planPrice').textContent = `₹${currentPrice}`;
}

function calculateTotal() {
  const gst = Math.round(currentPrice * 0.18 * 100) / 100;
  const total = Math.round((currentPrice + gst) * 100) / 100;
  document.getElementById('subtotal').textContent = `₹${currentPrice.toFixed(2)}`;
  document.getElementById('gst').textContent = `₹${gst.toFixed(2)}`;
  document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
  document.getElementById('payBtn').textContent = `Pay ₹${total.toFixed(2)}`;
  document.getElementById('planPrice').textContent = `₹${currentPrice}`;

  const nextDate = new Date();
  if (currentBilling === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
  else nextDate.setFullYear(nextDate.getFullYear() + 1);

  document.getElementById('nextBilling').textContent =
    `Next billing: ${nextDate.toLocaleDateString('en-IN')}`;
}

document.querySelectorAll('.billing-option').forEach(option => {
  option.addEventListener('click', function() {
    document.querySelectorAll('.billing-option').forEach(o => o.classList.remove('active'));
    this.classList.add('active');
    currentBilling = this.dataset.type;
    currentPrice = planData[currentPlan][currentBilling];
    originalPrice = currentPrice;
    if (promoApplied) {
      const discount = Math.round(originalPrice * 0.1 * 100) / 100;
      currentPrice = originalPrice - discount;
    }
    calculateTotal();
  });
});

document.querySelectorAll('.payment-method').forEach(method => {
  method.addEventListener('click', function() {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.form-section').forEach(s => s.style.display = 'none');
    const selectedMethod = this.dataset.method;
    document.getElementById(selectedMethod + 'Section').style.display = 'block';
  });
});

document.getElementById('cardNumber').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  e.target.value = value.match(/.{1,4}/g)?.join(' ') || '';
});

document.getElementById('expiry').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
  e.target.value = value;
});

const promoCodes = { 'SAVE10': 10, 'WELCOME': 25, 'STUDENT': 15, 'FIRST': 20 };

function applyPromo() {
  const code = document.getElementById('promoCode').value.toUpperCase();
  const messageDiv = document.getElementById('promoMessage');
  if (promoCodes[code] && !promoApplied) {
    const discountPercent = promoCodes[code];
    const discount = Math.round(originalPrice * (discountPercent / 100) * 100) / 100;
    currentPrice = originalPrice - discount;
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('discount').textContent = `₹${discount.toFixed(2)}`;
    messageDiv.innerHTML = `<div class="success-message">Code applied! Saved ₹${discount.toFixed(2)} (${discountPercent}% off)</div>`;
    document.querySelector('.apply-btn').disabled = true;
    document.querySelector('.apply-btn').textContent = 'Applied';
    document.getElementById('promoCode').disabled = true;
    promoApplied = true;
    calculateTotal();
  } else {
    messageDiv.innerHTML = '<div class="error-message">Invalid or already used code</div>';
  }
}

function validateForm() {
  const activeMethod = document.querySelector('.payment-method.active').dataset.method;
  if (activeMethod === 'card') {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;
    if (cardNumber.length !== 16 || !/^\d{2}\/\d{2}$/.test(expiry) || cvv.length !== 3 || cardName.trim().length < 2) {
      alert('Please fill valid card details');
      return false;
    }
  }
  return true;
}

document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const txnId = 'TXN' + Date.now();
  showSuccessModal(txnId);
});

function showSuccessModal(txnId) {
  document.getElementById('txnIdDisplay').textContent = txnId;
  document.getElementById('planDisplay').textContent = planData[currentPlan].name;
  document.getElementById('amountDisplay').textContent = document.getElementById('total').textContent;
  document.getElementById('nextBillingDisplay').textContent =
    document.getElementById('nextBilling').textContent.replace('Next billing: ', '');
  document.getElementById('successModal').classList.add('show');
}

function redirectToDashboard() {
  window.location.href = 'discover.html?premium=true';
}

document.addEventListener('DOMContentLoaded', function() {
  getSelectedPlan();
  calculateTotal();
});
