/* =====================================
   Campus Cafe - Order JavaScript
   File: js/order.js
   ===================================== */

// 1. Get HTML elements
const orderForm = document.getElementById("order-form");
const message = document.getElementById("message");
const ordersBody = document.getElementById("orders-body");
const clearButton = document.getElementById("clear-orders");

// 2. Local storage key
const STORAGE_KEY = "campusCafeOrders";

// 3. Load saved orders from localStorage
function getOrders() {
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEY);
    const orders = savedOrders ? JSON.parse(savedOrders) : [];

    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Could not load saved orders:", error);
    return [];
  }
}

// 4. Save orders to localStorage
function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error("Could not save orders:", error);
    return false;
  }
}

// 5. Display orders in the table
function displayOrders() {
  const orders = getOrders();

  // Remove old table rows
  ordersBody.replaceChildren();

  // Show a message if there are no orders
  if (orders.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.textContent = "No orders yet.";

    row.appendChild(cell);
    ordersBody.appendChild(row);
    return;
  }

  // Create a table row for each order
  orders.forEach(function (order) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = order.name;

    const itemCell = document.createElement("td");
    itemCell.textContent =
      order.item + " (" + order.size + ")";

    const quantityCell = document.createElement("td");
    quantityCell.textContent = order.quantity;

    const pickupCell = document.createElement("td");
    pickupCell.textContent = order.pickup;

    const extrasCell = document.createElement("td");
    extrasCell.textContent =
      order.extras.length > 0
        ? order.extras.join(", ")
        : "None";

    // Add cells to the row
    row.append(
      nameCell,
      itemCell,
      quantityCell,
      pickupCell,
      extrasCell
    );

    // Add row to the table
    ordersBody.appendChild(row);
  });
}

// 6. Handle form submission
orderForm.addEventListener("submit", function (event) {
  // Prevent page reload
  event.preventDefault();

  // Get values from the form
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const item = document.getElementById("item").value;
  const quantity = Number(document.getElementById("qty").value);
  const pickup = document.getElementById("pickup").value;
  const notes = document.getElementById("notes").value.trim();

  // Get selected size
  const selectedSize = document.querySelector(
    'input[name="size"]:checked'
  );

  const size = selectedSize
    ? selectedSize.value
    : "Medium";

  // Get selected extras
  const extras = Array.from(
    document.querySelectorAll(
      'input[name="extras"]:checked'
    )
  ).map(function (checkbox) {
    return checkbox.value;
  });

  // Basic validation
  if (!name || !phone || !item || !pickup) {
    message.textContent = "Please fill in all required fields.";
    return;
  }

  if (quantity < 1 || quantity > 10) {
    message.textContent = "Quantity must be between 1 and 10.";
    return;
  }

  // Create a new order object
  const newOrder = {
    name: name,
    phone: phone,
    item: item,
    quantity: quantity,
    pickup: pickup,
    size: size,
    extras: extras,
    notes: notes
  };

  // Get existing orders
  const orders = getOrders();

  // Add the new order
  orders.push(newOrder);

  // Save and display the order
  if (saveOrders(orders)) {
    displayOrders();

    message.textContent =
      "Order saved successfully! Your order is stored in this browser.";

    // Reset the form after saving
    orderForm.reset();
  } else {
    message.textContent =
      "Order could not be saved. Please check your browser storage settings.";
  }
});

// 7. Clear all saved orders
clearButton.addEventListener("click", function () {
  const orders = getOrders();

  // Do not clear unnecessarily if there are no orders
  if (orders.length === 0) {
    message.textContent = "There are no saved orders to clear.";
    return;
  }

  // Ask for confirmation
  const confirmed = window.confirm(
    "Are you sure you want to clear all saved orders?"
  );

  if (confirmed) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      displayOrders();

      message.textContent = "All saved orders have been cleared.";
    } catch (error) {
      console.error("Could not clear orders:", error);

      message.textContent =
        "Could not clear orders. Please try again.";
    }
  }
});

// 8. Display previously saved orders when page opens
displayOrders();