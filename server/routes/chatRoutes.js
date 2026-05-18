const express = require("express");
const router = express.Router();
const axios = require("axios");

const Product = require("../models/productModel");

router.post("/", async (req, res) => {

    try {

        const { message } = req.body;

        // SEARCH PRODUCTS FROM DATABASE

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
                        $regex: message,
                        $options: "i"
                    }
                }
            ]
        }).limit(5);

        // PRODUCT INFO STRING

        let productInfo = "";
        if (products.length > 0) {

    let reply = "Here are some products:\n\n";

    products.forEach((p, index) => {

        reply += `
${index + 1}. ${p.name}

Price: ₹${p.price}

Category: ${p.category}

`;

    });

    return res.json({ reply });
}

        // FINAL AI PROMPT

        const finalPrompt = `
        You are an ecommerce AI assistant.

        Customer Question:
        ${message}

        Available Products:
        ${productInfo}

        Rules:
        - Reply like a shopping assistant.
        - If products exist, recommend them.
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