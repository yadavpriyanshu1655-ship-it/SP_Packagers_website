require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const twilio = require("twilio");

const app = express();
const PORT = process.env.PORT || 3000;
const DELIVERY_PASSWORD = process.env.DELIVERY_PASSWORD || "spdeliver2026";

function isDeliveryAuthorized(req) {
  const queryPassword = req.query.pass;
  if (queryPassword === DELIVERY_PASSWORD) return true;

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString();
    if (decoded === `delivery:${DELIVERY_PASSWORD}`) return true;
  }

  return false;
}

function deliveryAccessHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Delivery Access</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Arial, sans-serif;
      background: #f7f5f1;
      color: #1d1d1d;
    }
    .box {
      width: min(440px, 90vw);
      background: white;
      border: 1px solid #e7e1d6;
      border-radius: 16px;
      padding: 30px 24px;
      box-shadow: 0 12px 28px rgba(0,0,0,0.08);
    }
    h2 { margin-top: 0; color: #1b1b1b; }
    p { color: #666; margin-bottom: 20px; }
    input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid #ddd;
      font-size: 15px;
      margin-bottom: 16px;
    }
    button {
      width: 100%;
      border: none;
      background: #d93025;
      color: white;
      padding: 12px 16px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
    }
    .hint {
      margin-top: 12px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="box">
    <h2>Delivery Access</h2>
    <p>Enter the delivery password to open the order dashboard.</p>
    <form method="get" action="/admin.html">
      <input type="password" name="pass" placeholder="Password" required />
      <button type="submit">Open Dashboard</button>
    </form>
    <div class="hint">Password is stored in .env as DELIVERY_PASSWORD</div>
  </div>
</body>
</html>`;
}

// =============================
// DATA FILES
// =============================

const DATA_DIR = path.join(__dirname, "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, "[]");
}

// =============================
// MIDDLEWARE
// =============================

app.use(express.json());

app.get("/admin.html", (req, res, next) => {
  if (isDeliveryAuthorized(req)) {
    return next();
  }

  return res.status(403).send(deliveryAccessHtml());
});

app.use(express.static(path.join(__dirname, "public")));

// =============================
// ORDER FILE FUNCTIONS
// =============================

function readOrders() {
  try {
    return JSON.parse(
      fs.readFileSync(ORDERS_FILE, "utf8")
    );
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(
    ORDERS_FILE,
    JSON.stringify(orders, null, 2)
  );
}

// =============================
// WHATSAPP WEBHOOK VERIFICATION
// =============================

const VERIFY_TOKEN =
  process.env.WEBHOOK_VERIFY_TOKEN;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("📡 Webhook verification request received");

  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN
  ) {
    console.log("✅ Webhook verified successfully");

    return res
      .status(200)
      .send(challenge);
  }

  console.log("❌ Webhook verification failed");

  return res.sendStatus(403);
});

// =============================
// RECEIVE WHATSAPP WEBHOOK
// =============================

app.post("/webhook", (req, res) => {

  console.log("📩 WhatsApp webhook received:");

  console.log(
    JSON.stringify(req.body, null, 2)
  );

  res.sendStatus(200);
});

// =============================
// WHATSAPP CLOUD API
// =============================

async function sendWhatsAppOrder(order) {

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN;

  const recipient =
    process.env.WHATSAPP_RECIPIENT;

  const apiVersion =
    process.env.WHATSAPP_API_VERSION ||
    "v25.0";

  // Check configuration

  if (
    !phoneNumberId ||
    !accessToken ||
    !recipient
  ) {

    console.log(
      "❌ WhatsApp settings are missing in .env"
    );

    return {
      success: false,
      error:
        "WhatsApp configuration missing"
    };
  }

  // =============================
  // PRODUCTS
  // =============================

  const itemsText = order.items
    .map((item) => {

      const name =
        item.name ||
        item.title ||
        "Product";

      const quantity =
        item.quantity ||
        item.qty ||
        1;

      const price =
        item.price || 0;

      return (
        `• ${name} x ${quantity} = ₹${price}`
      );
    })
    .join("\n");

  // =============================
  // MESSAGE
  // =============================

  const message = `
🔔 NEW ORDER - SP PACKAGERS

Order ID: ${order.id}

👤 Customer:
${order.customer.name}

📱 Phone:
${order.customer.phone}

📦 Products:
${itemsText}

💰 Subtotal: ₹${order.subtotal}

🚚 Delivery: ₹${order.delivery}

💵 Total: ₹${order.total}

💳 Payment:
${order.payment}

📝 Note:
${order.note || "No note"}

🕒 Order Time:
${new Date(
    order.createdAt
  ).toLocaleString("en-IN")}
`;

  // =============================
  // SEND TO WHATSAPP
  // =============================

  try {

    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          messaging_product:
            "whatsapp",

          recipient_type:
            "individual",

          to: recipient,

          type: "text",

          text: {
            preview_url: false,
            body: message.trim()
          }

        })
      }
    );

    const data =
      await response.json();

    // =============================
    // API ERROR
    // =============================

    if (!response.ok) {

      console.error(
        "❌ WhatsApp API Error:"
      );

      console.error(
        JSON.stringify(
          data,
          null,
          2
        )
      );

      return {
        success: false,
        error:
          data?.error?.message ||
          "WhatsApp message failed"
      };
    }

    // =============================
    // SUCCESS
    // =============================

    console.log(
      "✅ WhatsApp API accepted message."
    );

    console.log(
      "Message ID:",
      data.messages?.[0]?.id
    );

    return {
      success: true,

      messageId:
        data.messages?.[0]?.id ||
        null
    };

  } catch (error) {

    console.error(
      "❌ WhatsApp connection error:",
      error
    );

    return {
      success: false,
      error:
        "Could not connect to WhatsApp API"
    };
  }
}

// =============================
// SEND SMS NOTIFICATION (Twilio)
// =============================

async function sendSMSOrder(order) {

  const accountSid =
    process.env.TWILIO_ACCOUNT_SID;

  const authToken =
    process.env.TWILIO_AUTH_TOKEN;

  const twilioPhone =
    process.env.TWILIO_PHONE_NUMBER;

  const recipientPhone =
    process.env.SMS_RECIPIENT_PHONE;

  // Check configuration

  if (
    !accountSid ||
    !authToken ||
    !twilioPhone ||
    !recipientPhone
  ) {

    console.log(
      "❌ SMS settings are missing in .env"
    );

    return {
      success: false,
      error:
        "SMS configuration missing"
    };
  }

  // =============================
  // CREATE MESSAGE
  // =============================

  const itemsText = order.items
    .map((item) => {

      const name =
        item.name ||
        item.title ||
        "Product";

      const quantity =
        item.quantity ||
        item.qty ||
        1;

      const price =
        item.price || 0;

      return (
        `${name} x${quantity} = ₹${price}`
      );
    })
    .join("\n");

  const message = `
🔔 NEW ORDER - SP PACKAGERS

Order ID: ${order.id}

Customer: ${order.customer.name}
Phone: ${order.customer.phone}
Business: ${order.customer.business || "N/A"}

Items:
${itemsText}

Subtotal: ₹${order.subtotal}
Delivery: ₹${order.delivery}
Total: ₹${order.total}

Payment: ${order.payment}
Time: ${new Date(
    order.createdAt
  ).toLocaleString("en-IN")}
`.trim();

  // =============================
  // SEND SMS VIA TWILIO
  // =============================

  try {

    const client = twilio(
      accountSid,
      authToken
    );

    const response =
      await client.messages.create({

        body: message,

        from: twilioPhone,

        to: recipientPhone
      });

    console.log(
      "✅ SMS sent successfully"
    );

    console.log(
      "Message SID:",
      response.sid
    );

    return {
      success: true,
      messageId: response.sid
    };

  } catch (error) {

    console.error(
      "❌ SMS Error:",
      error.message
    );

    return {
      success: false,
      error:
        error.message ||
        "SMS failed to send"
    };
  }
}

// =============================
// GET ALL ORDERS
// =============================

app.get("/api/orders", (req, res) => {

  const orders = readOrders();

  orders.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  res.json(orders);
});

// =============================
// CREATE NEW ORDER
// =============================

app.post(
  "/api/orders",
  async (req, res) => {

    const body = req.body || {};

    // =============================
    // VALIDATION
    // =============================

    if (
      !body.customer?.name ||
      !body.customer?.phone ||
      !body.items?.length
    ) {

      return res.status(400).json({
        error:
          "Customer name, phone and at least one product are required."
      });
    }

    const orders =
      readOrders();

    // =============================
    // CREATE ORDER
    // =============================

    const order = {

      id:
        "SP-" +
        Date.now()
          .toString()
          .slice(-8),

      createdAt:
        new Date().toISOString(),

      status:
        "New",

      customer:
        body.customer,

      items:
        body.items,

      subtotal:
        Number(
          body.subtotal || 0
        ),

      delivery:
        Number(
          body.delivery || 0
        ),

      total:
        Number(
          body.total || 0
        ),

      payment:
        body.payment ||
        "Cash on Delivery",

      note:
        body.note || ""
    };

    // =============================
    // SAVE ORDER
    // =============================

    orders.push(order);

    writeOrders(orders);

    console.log(
      `🛒 New order received: ${order.id}`
    );

    // =============================
    // SEND WHATSAPP NOTIFICATION
    // =============================

    let whatsappResult = null;

    if (
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_RECIPIENT
    ) {
      whatsappResult =
        await sendWhatsAppOrder(
          order
        );
    } else {
      console.log(
        "⚠️  WhatsApp credentials not configured, skipping WhatsApp notification"
      );
    }

    // =============================
    // SEND SMS NOTIFICATION
    // =============================

    let smsResult = null;

    // Send SMS if Twilio credentials are configured
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ) {
      smsResult =
        await sendSMSOrder(
          order
        );
    } else {
      console.log(
        "⚠️  SMS credentials not configured, skipping SMS notification"
      );
    }

    // =============================
    // RESPONSE
    // =============================

    res.status(201).json({

      ...order,

      whatsapp:
        whatsappResult,

      sms:
        smsResult,

      message:
        "✅ Order created successfully"

    });

  }
);

// =============================
// UPDATE ORDER STATUS
// =============================

app.patch(
  "/api/orders/:id",
  (req, res) => {

    const orders =
      readOrders();

    const order =
      orders.find(
        (o) =>
          o.id ===
          req.params.id
      );

    if (!order) {

      return res
        .status(404)
        .json({
          error:
            "Order not found"
        });
    }

    if (
      req.body.status
    ) {

      order.status =
        req.body.status;
    }

    writeOrders(orders);

    res.json(order);
  }
);

// =============================
// WEBSITE FALLBACK
// =============================

app.get("*", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});

// =============================
// START SERVER
// =============================

app.listen(
  PORT,
  () => {

    console.log(
      `🚀 SP Packagers running at http://localhost:${PORT}`
    );

    console.log(
      "📱 WhatsApp Cloud API: ENABLED"
    );

    console.log(
      "🔗 Webhook endpoint: /webhook"
    );

  }
);