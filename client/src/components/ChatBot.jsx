import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {

    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello 👋 Ask me anything"
        }
    ]);

    const sendMessage = async () => {

        if (!message) return;

        const userMessage = {
            sender: "user",
            text: message
        };

        setMessages((prev) => [...prev, userMessage]);

        try {

            const res = await axios.post(
                "https://e-commerce-mern-stack-0okr.onrender.com/api/chat",
                {
                    message
                }
            );

            const botMessage = {
                sender: "bot",
                text: res.data.reply
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {

            console.log(error);

        }

        setMessage("");
    };

    return (
        <>
            {/* Floating Button */}

            <div
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "black",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    zIndex: 999
                }}
            >
                💬
            </div>

            {/* Chat Window */}

            {
                open && (

                    <div
                        style={{
                            position: "fixed",
                            bottom: "90px",
                            right: "20px",
                            width: "350px",
                            height: "430px",
                            background: "white",
                            borderRadius: "10px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 999
                        }}
                    >

                        <div
                            style={{
                                background: "black",
                                color: "white",
                                padding: "15px",
                                borderRadius: "8px",
                            }}
                        >
                            Ask Me
                        </div>

                        <div
                            style={{
                                flex: 1,
                                padding: "10px",
                                overflowY: "auto"
                            }}
                        >

                            {
                                messages.map((msg, index) => (

                                    <div
                                        key={index}
                                        style={{
                                            textAlign:
                                                msg.sender === "user"
                                                    ? "right"
                                                    : "left",
                                            marginBottom: "10px"
                                        }}
                                    >

                                        <span
                                            style={{
                                                background:
                                                    msg.sender === "user"
                                                        ? "#007bff"
                                                        : "#eee",

                                                color:
                                                    msg.sender === "user"
                                                        ? "white"
                                                        : "black",

                                                padding: "8px 12px",

                                                borderRadius: "10px",

                                                display: "inline-block"
                                            }}
                                        >
                                            {msg.text}
                                        </span>

                                    </div>

                                ))
                            }

                        </div>

                        <div
                            style={{
                                display: "flex",
                                padding: "10px",
                                borderTop: "1px solid #ddd"
                            }}
                        >

                            <input
                                type="text"

                                placeholder="Ask something..."

                                value={message}

                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }

                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage();
                                    }
                                }}

                                style={{
                                    flex: 1,
                                    padding: "10px"
                                }}
                            />
                            

                            <button
                                onClick={sendMessage}

                                style={{
                                    marginLeft: "10px"
                                }}
                            >
                                Send
                            </button>

                        </div>

                    </div>

                )
            }

        </>
    );
};

export default ChatBot;