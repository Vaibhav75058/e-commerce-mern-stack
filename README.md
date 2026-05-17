# 🛍️ ShopEase – MERN Stack Ecommerce Website with AI Chatbot

A modern full-stack Ecommerce web application built using the MERN Stack with authentication, cart system, order management, admin features, and an AI-powered shopping assistant chatbot.

---

# 🚀 Features

## 👤 User Features

- User Authentication (Login/Register)
- JWT Authentication
- Browse Products
- Product Details Page
- Add to Cart
- Remove from Cart
- Order Placement
- Order History
- Responsive UI

---

## 🛠️ Admin Features

- Admin Dashboard
- Add Products
- Edit Products
- Delete Products
- Manage Orders
- Manage Users
- Admin Role-based Access
- MongoDB Admin Control
- Admin access is controlled using role-based authentication stored in MongoDB Atlas.

---

## 🛒 Ecommerce Features
- Product Categories
- Search Products
- Dynamic Product Listing
- Cart Management
- Checkout Flow
- Order Management

---

## 🤖 AI Chatbot Features
- Floating AI Chatbot
- Smart Product Search
- Product Recommendation
- MongoDB Product Fetching
- AI Shopping Assistant
- Real-time Chat Responses

---

# 🧠 Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- CSS / Inline Styling

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## AI Integration
- OpenRouter API
- GPT Model Integration

---

# 📂 Project Structure

```bash
shopease/
│
├── client/        # React Frontend
│
├── server/        # Node + Express Backend
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Vaibhav75058/e-commerce-mern-stack.git
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside `server/`

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

# ▶️ Run Project

## Backend

```bash
cd server
npm run dev
```

---

## Frontend

```bash
cd client
npm run dev
```

OR

```bash
npm start
```

(depending on your frontend setup)

---

# 🤖 Chatbot API

```bash
POST /api/chat
```

Example Request:

```json
{
  "message": "show iphone"
}
```

---

# 📸 Screenshots

<img width="950" height="437" alt="image" src="https://github.com/user-attachments/assets/3e19f41f-96af-4a04-bd36-281c744377e5" />
<img width="947" height="449" alt="image" src="https://github.com/user-attachments/assets/78b01bb4-717d-47a4-a3c9-34288a8ada30" />
<img width="939" height="431" alt="image" src="https://github.com/user-attachments/assets/33825afe-c365-451d-a6bb-9be29f801ce2" />
<img width="950" height="445" alt="image" src="https://github.com/user-attachments/assets/ba99d2ee-dc73-4d64-aea4-2e97465e375c" />
<img width="947" height="448" alt="image" src="https://github.com/user-attachments/assets/735ea8a5-3c65-46e6-8cd9-d0d6c72d09fa" />
<img width="940" height="445" alt="image" src="https://github.com/user-attachments/assets/16a9adb6-77c9-40ac-b214-d1adb1faa219" />
<img width="950" height="446" alt="image" src="https://github.com/user-attachments/assets/bc2a7c77-f679-4e7c-bd38-b74c35ae5996" />
<img width="949" height="446" alt="image" src="https://github.com/user-attachments/assets/27b93fce-3ad0-4e31-967d-9541446ae89a" />
<img width="945" height="443" alt="image" src="https://github.com/user-attachments/assets/92a0997a-6e4d-4be4-bfa8-4ff204c61700" />
<img width="947" height="446" alt="image" src="https://github.com/user-attachments/assets/1be60599-d0df-4699-bfea-64e6837a9a12" />



---

# 🌟 Future Improvements

- Payment Gateway Integration
- Wishlist Feature
- Admin Dashboard
- Product Reviews
- Voice AI Assistant
- AI Personalized Recommendations
- Dark Mode
- Real-time Notifications

---

# 👨‍💻 Author

### Vaibhav Sharma

Made with ❤️ using MERN Stack

---

# 📄 License

This project is licensed under the MIT License.
