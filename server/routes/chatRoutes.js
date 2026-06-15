const express = require("express");
const router = express.Router();
const axios = require("axios");

const Product = require("../models/product");
const Category = require("../models/category");

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        // 1. SEARCH CATEGORIES MATCHING THE MESSAGE
        const matchedCategories = await Category.find({
            name: {
                $regex: message,
                $options: "i"
            }
        });
        const categoryIds = matchedCategories.map(c => c._id);

        // 2. SEARCH PRODUCTS MATCHING NAME OR CATEGORY ID
        const products = await Product.find({
            $or: [
                {
                    name: {
                        $regex: message,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $in: categoryIds
                    }
                }
            ]
        }).populate("category").limit(5);

        // PRODUCT INFO STRING
        if (products.length > 0) {
            let reply = "Here are some products:\n\n";
            products.forEach((p, index) => {
                const catName = p.category?.name || "Product";
                reply += `\n${index + 1}. ${p.name}\nPrice: ₹${p.price}\nCategory: ${catName}\n`;
            });
            return res.json({ reply });
        }

        // FINAL AI PROMPT
        const finalPrompt = `
        You are an ecommerce AI assistant.

        Customer Question:
        ${message}

        Available Products:
        (None found matching your search)

        Rules:
        - Reply like a shopping assistant.
        - Keep answers short and helpful.
        `;

        // OPENROUTER API
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: finalPrompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            reply: response.data.choices[0].message.content
        });

    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json({
            error: "AI Error"
        });
    }
});

module.exports = router;