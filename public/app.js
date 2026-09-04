const products = [

  {
    id: 1,
    name: "250g Box",
    cat: "Bakery",
    price: 7.50,
    unit: "piece",
    icon: "📦",
    image: "/images/250g-box.png",
    desc: "250g cake box, size 7 × 7 × 5 inch."
  },

  {
    id: 2,
    name: "250g Base",
    cat: "Bakery",
    price: 3.50,
    unit: "piece",
    icon: "📦",
    image: "/images/base.png",
    desc: "250g cake box base."
  },

  {
    id: 3,
    name: "½ kg Box",
    cat: "Bakery",
    price: 10,
    unit: "piece",
    icon: "📦",
    image: "/images/half-kg-box.png",
    desc: "½ kg cake box, size 8 × 8 × 5.5 inch."
  },

  {
    id: 4,
    name: "½ kg Window Box",
    cat: "Bakery",
    price: 12,
    unit: "piece",
    icon: "📦",
    image: "/images/half-kg-window-box.png",
    desc: "½ kg window cake box, size 8 × 8 × 5.5 inch."
  },

  {
    id: 5,
    name: "½ kg Base",
    cat: "Bakery",
    price: 4,
    unit: "piece",
    icon: "📦",
    image: "/images/base.png",
    desc: "½ kg cake box base."
  },

  {
    id: 6,
    name: "1 kg Box",
    cat: "Bakery",
    price: 15,
    unit: "piece",
    icon: "📦",
    image: "/images/1kg-box.png",
    desc: "1 kg cake box, size 10 × 10 × 6 inch."
  },

  {
    id: 7,
    name: "1 kg Base",
    cat: "Bakery",
    price: 7,
    unit: "piece",
    icon: "📦",
    image: "/images/base.png",
    desc: "1 kg cake box base."
  },

  {
    id: 8,
    name: "1.5 kg Box",
    cat: "Bakery",
    price: 40,
    unit: "piece",
    icon: "📦",
    image: "/images/1.5kg-box.png",
    desc: "1.5 kg cake box, size 12 × 12 × 9 inch."
  },

  {
    id: 9,
    name: "1.5 kg Base",
    cat: "Bakery",
    price: 15,
    unit: "piece",
    icon: "📦",
    image: "/images/base.png",
    desc: "1.5 kg cake box base."
  },

  {
    id: 10,
    name: "2 kg Box",
    cat: "Bakery",
    price: 45,
    unit: "piece",
    icon: "📦",
    image: "/images/2kg-box.png",
    desc: "2 kg cake box, size 14 × 14 × 10 inch."
  },

  {
    id: 11,
    name: "2 kg Base",
    cat: "Bakery",
    price: 20,
    unit: "piece",
    icon: "📦",
    image: "/images/base.png",
    desc: "2 kg cake box base."
  },

  {
    id: 12,
    name: "Pastree Box (Small)",
    cat: "Bakery",
    price: 3.50,
    unit: "piece",
    icon: "🧁",
    image: "/images/pastree-small.png",
    desc: "Small pastree packaging box."
  },

  {
    id: 13,
    name: "Pastree Box (Big)",
    cat: "Bakery",
    price: 4.50,
    unit: "piece",
    icon: "🧁",
    image: "/images/pastree-big.png",
    desc: "Big pastree packaging box."
  },

  {
    id: 14,
    name: "6 No. Pizza Box",
    cat: "Pizza",
    price: 3.35,
    unit: "piece",
    icon: "🍕",
    image: "/images/pizza-box-6x6.png",
    desc: "Brown pizza box, size 6 × 6 × 1.5 inch."
  },

  {
    id: 15,
    name: "7 No. Pizza Box",
    cat: "Pizza",
    price: 3.90,
    unit: "piece",
    icon: "🍕",
    image: "/images/pizza-box-7x7.png",
    desc: "Brown pizza box, size 7 × 7 × 1.5 inch."
  },

  {
    id: 16,
    name: "8 No. Pizza Box",
    cat: "Pizza",
    price: 4.50,
    unit: "piece",
    icon: "🍕",
    image: "/images/pizza-box-8x8.png",
    desc: "Brown pizza box, size 8 × 8 × 1.5 inch."
  },

  {
    id: 17,
    name: "9 No. Pizza Box",
    cat: "Pizza",
    price: 5.75,
    unit: "piece",
    icon: "🍕",
    image: "/images/pizza-box-9x9.png",
    desc: "Brown pizza box, size 9 × 9 × 1.5 inch."
  },

  {
    id: 18,
    name: "10 No. Pizza Box",
    cat: "Pizza",
    price: 6,
    unit: "piece",
    icon: "🍕",
    image: "/images/pizza-box-10x10.png",
    desc: "Brown pizza box, size 10 × 10 × 1.5 inch."
  },

  {
    id: 19,
    name: "12 No. Pizza Box",
    cat: "Pizza",
    price: 12,
    unit: "piece",
    icon: "🍕",
    image: "/images/pizza-box-12x12.png",
    desc: "Brown pizza box, size 12 × 12 × 1.5 inch."
  }

];


const RECEIPT_HISTORY_KEY = "sp_packagers_receipt_history";
const WHATSAPP_ORDER_NUMBER = "918887906448";

let cart = JSON.parse(localStorage.getItem("boxmart_cart") || "[]");
let currentReceipt = null;


function getReceiptHistory() {
  try {
    return JSON.parse(
      localStorage.getItem(RECEIPT_HISTORY_KEY) || "[]"
    );
  } catch {
    return [];
  }
}


function saveReceiptHistory(history) {
  localStorage.setItem(
    RECEIPT_HISTORY_KEY,
    JSON.stringify(history)
  );
}


function addReceiptToHistory(order) {
  const history = getReceiptHistory();

  const phone =
    ((order &&
      order.customer &&
      order.customer.phone) || "").trim();

  const id = (order && order.id) || "";

  if (!id || !phone) {
    return;
  }

  const normalizedHistory = history.filter(
    item =>
      !(
        item.id === id &&
        ((item.customer && item.customer.phone) || "") === phone
      )
  );

  normalizedHistory.push({
    ...order,
    storedAt: new Date().toISOString()
  });

  saveReceiptHistory(
    normalizedHistory
      .slice(-10)
      .sort(
        (a, b) =>
          new Date(b.storedAt) - new Date(a.storedAt)
      )
  );
}


function getReceiptHistoryForPhone(phone) {
  const normalized = (phone || "").trim().toLowerCase();

  return getReceiptHistory()
    .filter(
      item =>
        (
          (item.customer && item.customer.phone) || ""
        )
          .trim()
          .toLowerCase() === normalized
    )
    .sort(
      (a, b) =>
        new Date(b.storedAt) - new Date(a.storedAt)
    );
}


function money(n) {
  return n
    ? "₹" + n.toLocaleString("en-IN")
    : "Quote";
}


function renderProducts() {
  const q =
    (
      document.getElementById("search").value || ""
    ).toLowerCase();

  const c =
    document.getElementById("category").value;

  const list = products.filter(
    p =>
      (c === "all" || p.cat === c) &&
      (
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      )
  );

  document.getElementById("products").innerHTML =
    list
      .map(
        p => `
        <article class="product">

          <div class="product-img">
            ${
              p.image
                ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
                : p.icon
            }
          </div>

          <div class="product-body">

            <small>${p.cat}</small>

            <h3>${p.name}</h3>

            <p>${p.desc}</p>

            <div class="price">
              ${money(p.price)}
              <small>
                ${p.price ? "/ " + p.unit : ""}
              </small>
            </div>

            ${
              p.price
                ? `
                  <button
                    class="primary"
                    data-action="add-to-cart"
                    data-id="${p.id}">
                    Add to Cart
                  </button>
                `
                : `
                  <button
                    class="secondary"
                    data-action="open-quote">
                    Request Quote
                  </button>
                `
            }

          </div>

        </article>
      `
      )
      .join("") ||
    '<div class="empty">No products found.</div>';
}


function save() {
  localStorage.setItem(
    "boxmart_cart",
    JSON.stringify(cart)
  );

  updateCount();
}


function updateCount() {
  document.getElementById("cartCount").textContent =
    cart.reduce(
      (s, x) => s + x.qty,
      0
    );
}


function addToCart(id) {
  const p = products.find(x => x.id === id);

  let x = cart.find(x => x.id === id);

  if (x) {
    x.qty++;
  } else {
    cart.push({
      id,
      qty: 1
    });
  }

  save();

  toast(
    p.name + " added to cart"
  );
}


function openCart() {
  renderCart();

  document
    .getElementById("cartModal")
    .classList.remove("hidden");
}


function closeCart() {
  document
    .getElementById("cartModal")
    .classList.add("hidden");
}


function updateCartSummary() {
  const total = cart.reduce(
    (s, x) =>
      s +
      products.find(p => p.id === x.id).price *
        x.qty,
    0
  );

  document.getElementById("cartTotal").textContent =
    money(total);

  updateCount();
}


function renderCart() {
  const el =
    document.getElementById("cartItems");

  if (!cart.length) {
    el.innerHTML =
      '<div class="empty">Your cart is empty.</div>';

    document.getElementById("cartTotal").textContent =
      "₹0";

    return;
  }

  let total = 0;

  el.innerHTML = cart
    .map(x => {
      const p = products.find(
        a => a.id === x.id
      );

      const t = p.price * x.qty;

      total += t;

      return `
        <div class="cart-row">

          <div>
            <b>${p.name}</b>
            <small>
              ${money(p.price)} each
            </small>
          </div>

          <div class="qty">

            <button
              onclick="changeQty(${p.id},-1)">
              −
            </button>

            <input
              type="number"
              min="1"
              value="${x.qty}"
              onchange="setQty(${p.id}, this.value, true)"
              oninput="setQty(${p.id}, this.value, false)"
              aria-label="Quantity for ${p.name}"
            >

            <button
              onclick="changeQty(${p.id},1)">
              +
            </button>

          </div>

          <b>${money(t)}</b>

        </div>
      `;
    })
    .join("");

  document.getElementById("cartTotal").textContent =
    money(total);

  updateCount();
}


function setQty(id, value, shouldRender = true) {
  const blank =
    value === "" ||
    value === null ||
    value === undefined;

  const x = cart.find(a => a.id === id);

  if (!x) return;

  if (blank) {
    x.qty = 1;

    save();

    if (shouldRender) {
      renderCart();
    } else {
      updateCartSummary();
    }

    return;
  }

  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    x.qty = 1;

    save();

    if (shouldRender) {
      renderCart();
    } else {
      updateCartSummary();
    }

    return;
  }

  x.qty = parsed;

  save();

  if (shouldRender) {
    renderCart();
  } else {
    updateCartSummary();
  }
}


function changeQty(id, d) {
  const x = cart.find(
    a => a.id === id
  );

  if (!x) return;

  x.qty += d;

  if (x.qty <= 0) {
    cart = cart.filter(
      a => a.id !== id
    );
  }

  save();

  renderCart();
}


function openCheckout() {
  if (!cart.length) {
    toast("Add a product first");
    return;
  }

  closeCart();

  renderCheckout();

  document
    .getElementById("checkoutModal")
    .classList.remove("hidden");
}


function closeCheckout() {
  document
    .getElementById("checkoutModal")
    .classList.add("hidden");
}


function getCurrentReceipt() {
  if (
    window.currentReceipt &&
    window.currentReceipt.id
  ) {
    return window.currentReceipt;
  }

  if (
    currentReceipt &&
    currentReceipt.id
  ) {
    return currentReceipt;
  }

  const modal =
    document.getElementById(
      "receiptContent"
    );

  if (
    modal &&
    modal.dataset &&
    modal.dataset.receipt
  ) {
    try {
      const parsed =
        JSON.parse(
          modal.dataset.receipt
        );

      if (
        parsed &&
        parsed.id
      ) {
        return parsed;
      }
    } catch (err) {}
  }

  const text =
    modal
      ? modal.textContent
      : "";

  const match =
    text.match(
      /Order\s*ID\s*:?\s*([A-Z0-9-]+)/i
    ) ||
    text.match(
      /([A-Z]+-\d+)/i
    );

  const orderId =
    match
      ? match[1]
      : "";

  const history =
    getReceiptHistory();

  return history.find(
    item => item.id === orderId
  ) || null;
}


function openReceipt(order) {
  currentReceipt = order;

  window.currentReceipt =
    order;

  const receipt =
    document.getElementById(
      "receiptContent"
    );

  receipt.dataset.receipt =
    JSON.stringify(order);

  const phone =
    (
      (order.customer &&
        order.customer.phone) ||
      ""
    ).trim();

  const history =
    getReceiptHistoryForPhone(phone)
      .filter(
        item =>
          item.id !== order.id
      );

  const allItems =
    (order.items || [])
      .map(
        item =>
          `
          <li>
            <span>
              ${item.name} × ${item.qty}
            </span>

            <b>
              ${money(
                item.price *
                item.qty
              )}
            </b>
          </li>
          `
      )
      .join("") ||
    `
      <li>
        <span>No items</span>
      </li>
    `;

  const historyMarkup = `
    <div class="receipt-history">

      <h3>Receipt History</h3>

      ${
        history.length
          ? history
              .map(
                item =>
                  `
                  <button
                    class="history-btn"
                    data-action="open-history-receipt"
                    data-order-id="${item.id}">
                    ${item.id} •
                    ${new Date(
                      item.storedAt ||
                      item.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </button>
                  `
              )
              .join("")
          : `
            <div class="history-empty">
              No previous receipt yet
              for this phone number.
            </div>
          `
      }

    </div>
  `;

  receipt.innerHTML = `

    <div class="receipt-card">

      <div class="receipt-row">
        <span>Order ID</span>
        <b>${order.id}</b>
      </div>

      <div class="receipt-row">
        <span>Customer</span>
        <b>
          ${
            (order.customer &&
              order.customer.name) ||
            "-"
          }
        </b>
      </div>

      <div class="receipt-row">
        <span>Phone</span>
        <b>${phone || "-"}</b>
      </div>

      <div class="receipt-row">
        <span>Business</span>
        <b>
          ${
            (order.customer &&
              order.customer.business) ||
            "-"
          }
        </b>
      </div>

      <div class="receipt-row">
        <span>Address</span>
        <b>
          ${
            (order.customer &&
              order.customer.address) ||
            "-"
          }
        </b>
      </div>

      <div class="receipt-row">
        <span>Payment</span>
        <b>
          ${
            order.payment ||
            "Cash on Delivery"
          }
        </b>
      </div>

      <div class="receipt-divider"></div>

      <ul class="receipt-items">
        ${allItems}
      </ul>

      <div class="receipt-divider"></div>

      <div class="receipt-total">
        <span>Subtotal</span>
        <b>
          ${money(order.subtotal || 0)}
        </b>
      </div>

      <div class="receipt-total">
        <span>Delivery</span>
        <b>
          ${
            order.delivery &&
            Number(order.delivery) > 0
              ? money(order.delivery)
              : "FREE"
          }
        </b>
      </div>

      <div class="receipt-total grand">
        <span>Total</span>
        <b>
          ${money(order.total || 0)}
        </b>
      </div>

    </div>

    ${historyMarkup}
  `;

  document
    .getElementById("receiptModal")
    .classList.remove("hidden");
}


function closeReceipt() {
  document
    .getElementById("receiptModal")
    .classList.add("hidden");

  currentReceipt = null;

  if (window) {
    window.currentReceipt = null;
  }

  const modal =
    document.getElementById(
      "receiptContent"
    );

  if (modal) {
    delete modal.dataset.receipt;
  }
}


function getWhatsAppOrderMessage(order) {
  const items =
    (order.items || [])
      .map(
        item =>
          `• ${item.name} x ${item.qty} = ₹${
            Number(item.price || 0) *
            Number(item.qty || 1)
          }`
      )
      .join("\n");

  return [
    "*SP Packagers Order*",
    "",
    `Order ID: ${order.id}`,
    `Customer: ${
      (order.customer &&
        order.customer.name) ||
      "-"
    }`,
    `Phone: ${
      (order.customer &&
        order.customer.phone) ||
      "-"
    }`,
    `Business: ${
      (order.customer &&
        order.customer.business) ||
      "-"
    }`,
    `Address: ${
      (order.customer &&
        order.customer.address) ||
      "-"
    }`,
    `Payment: ${
      order.payment ||
      "Cash on Delivery"
    }`,
    "",
    "Items:",
    items || "No items",
    "",
    `Subtotal: ₹${Number(
      order.subtotal || 0
    ).toLocaleString("en-IN")}`,
    `Delivery: ₹${Number(
      order.delivery || 0
    ).toLocaleString("en-IN")}`,
    `Total: ₹${Number(
      order.total || 0
    ).toLocaleString("en-IN")}`
  ].join("\n");
}


function openWhatsAppOrder(order) {
  const activeOrder =
    order ||
    getCurrentReceipt();

  if (!activeOrder) return;

  const message =
    encodeURIComponent(
      getWhatsAppOrderMessage(
        activeOrder
      )
    );

  const url =
    `https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${message}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}


function downloadReceipt() {
  const current =
    getCurrentReceipt();

  if (!current) {
    toast(
      "No receipt available to download"
    );
    return;
  }

  const text = [
    "SP Packagers Receipt",
    "-------------------",
    `Order ID: ${current.id}`,
    `Customer: ${
      (current.customer &&
        current.customer.name) ||
      "-"
    }`,
    `Phone: ${
      (current.customer &&
        current.customer.phone) ||
      "-"
    }`,
    `Business: ${
      (current.customer &&
        current.customer.business) ||
      "-"
    }`,
    `Address: ${
      (current.customer &&
        current.customer.address) ||
      "-"
    }`,
    `Payment: ${
      current.payment ||
      "Cash on Delivery"
    }`,
    "",
    "Items:",
    ...(current.items || [])
      .map(
        item =>
          `- ${item.name} x ${item.qty} = ₹${
            (
              Number(item.price) *
              Number(item.qty)
            ).toLocaleString(
              "en-IN"
            )
          }`
      ),
    "",
    `Subtotal: ₹${Number(
      current.subtotal || 0
    ).toLocaleString("en-IN")}`,
    `Delivery: ₹${Number(
      current.delivery || 0
    ).toLocaleString("en-IN")}`,
    `Total: ₹${Number(
      current.total || 0
    ).toLocaleString("en-IN")}`
  ].join("\n");

  const blob =
    new Blob(
      [text],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    `receipt-${current.id}.txt`;

  a.style.display = "none";

  document.body.appendChild(a);

  try {
    a.click();
  } catch (err) {
    window.open(
      url,
      "_blank"
    );
  }

  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1500);
}


function renderCheckout() {
  const subtotal =
    cart.reduce(
      (s, x) =>
        s +
        products.find(
          p => p.id === x.id
        ).price *
        x.qty,
      0
    );

  const delivery = 0;

  document.getElementById(
    "checkoutSummary"
  ).innerHTML = `

    <div class="cart-total">
      <span>Subtotal</span>
      <b>${money(subtotal)}</b>
    </div>

    <div class="cart-total">
      <span>Delivery</span>
      <b>
        ${
          delivery
            ? money(delivery)
            : "FREE"
        }
      </b>
    </div>

    <div class="cart-total">
      <span>Grand Total</span>
      <b>
        ${money(
          subtotal + delivery
        )}
      </b>
    </div>
  `;
}


document
  .getElementById("checkoutForm")
  .addEventListener(
    "submit",
    async e => {

      e.preventDefault();

      const f =
        new FormData(
          e.target
        );

      const subtotal =
        cart.reduce(
          (s, x) =>
            s +
            products.find(
              p => p.id === x.id
            ).price *
            x.qty,
          0
        );

      const delivery = 0;

      const order = {
        customer: {
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          business: f.get("business"),
          address: f.get("address")
        },

        items:
          cart.map(x => {
            const p =
              products.find(
                p => p.id === x.id
              );

            return {
              id: p.id,
              name: p.name,
              qty: x.qty,
              price: p.price
            };
          }),

        subtotal,
        delivery,
        total:
          subtotal + delivery,

        payment:
          f.get("payment"),

        note:
          f.get("note")
      };

      try {

        const r =
          await fetch(
            "/api/orders",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  order
                )
            }
          );

        const saved =
          await r.json();

        if (!r.ok) {
          throw Error(
            saved.error
          );
        }

        addReceiptToHistory(
          saved
        );

        cart = [];

        save();

        closeCheckout();

        e.target.reset();

        openWhatsAppOrder(
          saved
        );

        openReceipt(
          saved
        );

        toast(
          "Order placed: " +
            saved.id
        );

      } catch (err) {

        toast(
          "Order saved failed. Is the server running?"
        );
      }
    }
  );


function openReceiptHistory() {
  const modal =
    document.getElementById(
      "receiptHistoryModal"
    );

  const input =
    document.getElementById(
      "receiptHistoryPhone"
    );

  const list =
    document.getElementById(
      "receiptHistoryListHome"
    );

  input.value = "";

  list.innerHTML = "";

  modal.classList.remove(
    "hidden"
  );
}


function closeReceiptHistory() {
  document
    .getElementById(
      "receiptHistoryModal"
    )
    .classList.add(
      "hidden"
    );
}


function renderReceiptHistoryHome(
  phone
) {
  const list =
    document.getElementById(
      "receiptHistoryListHome"
    );

  const history =
    getReceiptHistoryForPhone(
      phone
    ).sort(
      (a, b) =>
        new Date(
          b.storedAt ||
            b.createdAt
        ) -
        new Date(
          a.storedAt ||
            a.createdAt
        )
    );

  if (!history.length) {

    list.innerHTML =
      `
      <div class="history-empty">
        No previous receipt yet
        for this phone number.
      </div>
      `;

    return;
  }

  list.innerHTML =
    history
      .map(
        item =>
          `
          <button
            class="history-btn"
            data-action="open-history-receipt"
            data-order-id="${item.id}">
            ${item.id} •
            ${new Date(
              item.storedAt ||
              item.createdAt
            ).toLocaleDateString(
              "en-IN"
            )}
          </button>
          `
      )
      .join("");
}


function openQuote() {
  document
    .getElementById(
      "quoteModal"
    )
    .classList.remove(
      "hidden"
    );
}


function closeQuote() {
  document
    .getElementById(
      "quoteModal"
    )
    .classList.add(
      "hidden"
    );
}


function submitQuote(e) {
  e.preventDefault();

  closeQuote();

  toast(
    "Custom quote enquiry received. Connect this form to email/WhatsApp for live enquiries."
  );
}


function toast(msg) {
  const t =
    document.getElementById(
      "toast"
    );

  t.textContent = msg;

  t.style.display =
    "block";

  setTimeout(
    () =>
      t.style.display =
        "none",
    2800
  );
}


function showAdmin() {
  location.href =
    "/admin.html";
}


document.addEventListener(
  "click",
  event => {

    const trigger =
      event.target.closest(
        "[data-action]"
      );

    if (!trigger) return;

    const action =
      trigger.dataset.action;

    if (
      action ===
      "open-cart"
    )
      openCart();

    if (
      action ===
      "close-cart"
    )
      closeCart();

    if (
      action ===
      "open-checkout"
    )
      openCheckout();

    if (
      action ===
      "close-checkout"
    )
      closeCheckout();

    if (
      action ===
      "close-receipt"
    )
      closeReceipt();

    if (
      action ===
      "send-whatsapp"
    )
      openWhatsAppOrder(
        getCurrentReceipt()
      );

    if (
      action ===
      "open-receipt-history"
    )
      openReceiptHistory();

    if (
      action ===
      "close-receipt-history"
    )
      closeReceiptHistory();

    if (
      action ===
      "open-history-receipt"
    ) {

      const orderId =
        trigger.dataset.orderId;

      const order =
        getReceiptHistory()
          .find(
            item =>
              item.id ===
              orderId
          );

      if (order) {
        openReceipt(
          order
        );
      }
    }

    if (
      action ===
      "open-quote"
    )
      openQuote();

    if (
      action ===
      "close-quote"
    )
      closeQuote();

    if (
      action ===
      "add-to-cart"
    ) {

      const id =
        Number(
          trigger.dataset.id ||
            0
        );

      if (id) {
        addToCart(id);
      }
    }
  }
);


document.addEventListener(
  "click",
  event => {

    const card =
      event.target.closest(
        ".feature-grid article"
      );

    if (!card) return;

    document
      .querySelectorAll(
        ".feature-grid article"
      )
      .forEach(item => {

        item.classList.toggle(
          "active",
          item === card
        );

      });
  }
);


document
  .getElementById(
    "receiptHistorySearchBtn"
  )
  .addEventListener(
    "click",
    () => {

      const phone =
        document
          .getElementById(
            "receiptHistoryPhone"
          )
          .value
          .trim();

      if (!phone) {
        toast(
          "Enter your phone number"
        );
        return;
      }

      renderReceiptHistoryHome(
        phone
      );
    }
  );


document
  .getElementById(
    "receiptHistoryPhone"
  )
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        const phone =
          document
            .getElementById(
              "receiptHistoryPhone"
            )
            .value
            .trim();

        if (!phone) {
          toast(
            "Enter your phone number"
          );
          return;
        }

        renderReceiptHistoryHome(
          phone
        );
      }
    }
  );


document
  .getElementById(
    "downloadReceiptBtn"
  )
  .addEventListener(
    "click",
    downloadReceipt
  );


renderProducts();

updateCount();
