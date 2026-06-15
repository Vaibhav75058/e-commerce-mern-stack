const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const Product = require("../models/product");
const Category = require("../models/category");
const Order = require("../models/Order");
const User = require("../models/User");

// Optional Authentication Middleware to get logged-in user details
const getOptionalUser = async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
        } catch (error) {
            console.log("Chat optional auth error:", error.message);
        }
    }
    next();
};

router.post("/", getOptionalUser, async (req, res) => {
    try {
        const { message, history } = req.body;
        const msgLower = message.toLowerCase();

        // 1. DYNAMIC CONTEXT RETRIEVAL
        let matchedProducts = [];
        let matchedCategories = [];
        let orderContext = "";

        // Check if message is querying products/categories
        const isProductQuery = msgLower.includes("product") || msgLower.includes("item") || 
                               msgLower.includes("buy") || msgLower.includes("show") || 
                               msgLower.includes("search") || msgLower.includes("find") ||
                               msgLower.includes("category") || msgLower.length < 25; // short queries are often product searches

        if (isProductQuery) {
            // Find categories matching regex
            matchedCategories = await Category.find({
                name: { $regex: message, $options: "i" }
            });
            const categoryIds = matchedCategories.map(c => c._id);

            // Find matching products
            matchedProducts = await Product.find({
                $or: [
                    { name: { $regex: message, $options: "i" } },
                    { category: { $in: categoryIds } }
                ]
            }).populate("category").limit(5);
        }

        // Check if message is querying order status
        const isOrderQuery = msgLower.includes("order") || msgLower.includes("track") || 
                             msgLower.includes("delivery") || msgLower.includes("status") || 
                             msgLower.includes("ship") || msgLower.includes("cancel");

        if (isOrderQuery && req.user) {
            // Fetch user's recent orders
            const orders = await Order.find({ user: req.user._id })
                .sort({ createdAt: -1 })
                .limit(3);

            if (orders.length > 0) {
                orderContext = "User's Recent Orders:\n";
                orders.forEach((order, idx) => {
                    const items = order.orderItems.map(item => `${item.qty}x ${item.name}`).join(", ");
                    orderContext += `- Order ID: ${order._id}, Status: ${order.status}, Items: [${items}], Total: ₹${order.totalPrice}, Paid: ${order.isPaid}, Delivered: ${order.isDelivered}\n`;
                });
            } else {
                orderContext = "User has no orders yet in the database.\n";
            }
        } else if (isOrderQuery && !req.user) {
            orderContext = "User is not logged in. Tell them to log in to track their orders.\n";
        }

        // 2. CONTEXT FORMATTING FOR AI
        let productInfoContext = "";
        if (matchedProducts.length > 0) {
            productInfoContext = "Available Matching Products in Catalog:\n";
            matchedProducts.forEach((p, index) => {
                const catName = p.category?.name || "Product";
                productInfoContext += `- Product ID: ${p._id}, Name: ${p.name}, Price: ₹${p.price}, Category: ${catName}, Brand: ${p.brand}, Stock: ${p.stock}\n`;
            });
        }

        const systemPrompt = `
        You are ShopEase's friendly AI Shopping Assistant.
        
        Live App Context:
        - Logged-in User Name: ${req.user ? req.user.name : "Guest"}
        - Logged-in User Email: ${req.user ? req.user.email : "Not Logged In"}
        
        ${productInfoContext}
        ${orderContext}
        
        Instructions:
        1. Always reply like a professional and helpful e-commerce shopping agent.
        2. If matching products are listed in the context, recommend them to the user naturally. Do NOT output raw product IDs to the user.
        3. If matching orders are found in the context, help the user track them by explaining their status (e.g. Processing, Shipped, Delivered) clearly.
        4. Keep your answers concise, clear, and focused on assisting the customer.
        5. Support formatting like lists, linebreaks, and bold text.
        `;

        // 3. CONSTRUCT MESSAGES ARRAY WITH CONVERSATION HISTORY
        const messages = [
            {
                role: "system",
                content: systemPrompt
            }
        ];

        // Append conversation history if sent from mobile frontend
        if (history && Array.isArray(history)) {
            history.forEach(item => {
                // Ensure role is mapped correctly (OpenRouter expects 'user', 'assistant', 'system')
                const role = item.type === "user" ? "user" : "assistant";
                messages.push({
                    role: role,
                    content: item.text
                });
            });
        }

        // Append the current message
        messages.push({
            role: "user",
            content: message
        });

        // 4. CALL OPENROUTER API
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: messages
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const replyContent = response.data.choices[0].message.content;

        // 5. RESPONSE PAYLOAD
        // Send back the reply and the matched products array to render clickable cards on the frontend
        res.json({
            reply: replyContent,
            products: matchedProducts
        });

    } catch (error) {
        console.log("Chat Route Error:", error.response?.data || error.message);
        res.status(500).json({
            error: "AI Error"
        });
    }
});

module.exports = router;