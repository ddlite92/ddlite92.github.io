// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeb3YG-rbD4nCDtlYElVr7IAhUO8UkkEA",
  authDomain: "catfoodorder.firebaseapp.com",
  databaseURL: "https://catfoodorder-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "catfoodorder",
  storageBucket: "catfoodorder.firebasestorage.app",
  messagingSenderId: "626528960914",
  appId: "1:626528960914:web:3380be8662499993db814b",
  measurementId: "G-PJ9467MQ7M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM elements
const inputField = document.getElementById('input-field');
const addBtn = document.getElementById('add-btn');
const foodOptions = document.querySelectorAll('.food-option');
const clearHistoryBtn = document.getElementById('clear-history');
const orderHistory = document.getElementById('order-history');

let selectedFoods = [];

// Food selection logic
foodOptions.forEach(option => {
  option.addEventListener('click', () => {
    const food = option.dataset.food;
    
    option.classList.toggle('selected');
    
    if (selectedFoods.includes(food)) {
      selectedFoods = selectedFoods.filter(item => item !== food);
    } else {
      selectedFoods.push(food);
    }
    
    inputField.value = selectedFoods.length > 0 
      ? selectedFoods.join(', ') 
      : 'Select food items...';
  });
});

// Add to cart functionality
addBtn.addEventListener('click', async () => {
  if (selectedFoods.length === 0) {
    alert('Please select at least one food item!');
    return;
  }
  
  try {
    const orderRef = database.ref('orders').push();
    await orderRef.set({
      items: selectedFoods,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
    alert(`${selectedFoods.length} items added to cart!`);
    
    // Reset selection
    foodOptions.forEach(option => option.classList.remove('selected'));
    selectedFoods = [];
    inputField.value = 'Select food items...';
    
  } catch (error) {
    console.error('Error saving order:', error);
    alert('Failed to save order. Please try again.');
  }
});

// Display order history
function displayOrderHistory() {
  database.ref('orders').orderByChild('timestamp').limitToLast(5).on('value', (snapshot) => {
    if (!snapshot.exists()) {
      orderHistory.innerHTML = '<p class="empty-history">No orders yet</p>';
      return;
    }
    
    orderHistory.innerHTML = '';
    const orders = [];
    
    snapshot.forEach(childSnapshot => {
      orders.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Sort by timestamp (newest first)
    orders.sort((a, b) => b.timestamp - a.timestamp);
    
    orders.forEach(order => {
      const orderDate = new Date(order.timestamp).toLocaleString();
      const orderElement = document.createElement('div');
      orderElement.className = 'order-item';
      orderElement.innerHTML = `
        <h3>${orderDate}</h3>
        <ul>
          ${order.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
      orderHistory.appendChild(orderElement);
    });
  });
}

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all order history?')) {
    database.ref('orders').remove()
      .then(() => {
        orderHistory.innerHTML = '<p class="empty-history">No orders yet</p>';
      })
      .catch(error => {
        console.error('Error clearing history:', error);
        alert('Failed to clear history. Please try again.');
      });
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayOrderHistory();
});