# 💡 Qintronics Electronics Store - Full-Stack

Qintronics is a comprehensive full-stack e-commerce application built to provide a seamless shopping experience for electronics. It features robust functionalities for customers, admins, and delivery personnel, ensuring an efficient and scalable solution.

# 🖥️ Technologies Used

**Frontend:**

- **React:** Component-based user interface.
- **Tailwind CSS:** For modern and responsive styling.
- **Framer Motion:** For animations.
- **TypeScript:** Ensures type safety and is used for the entire frontend codebase.

**Backend:**

- **Node.js:** Server-side runtime.
- **NestJS:** Framework for scalable backend architecture.
- **TypeORM:** ORM for database interactions.
- **TypeScript:** Used for the backend to enforce type safety and provide a consistent development experience.

**Database:**

- **PostgreSQL:** Relational database for storing application data.

**Documentation:**

- **Swagger:** API documentation.

# 📂 Project Structure

**The project is divided into two main directories:**

1. Client: Contains the frontend code.
2. Server: Contains the backend code.

**Server Folder Structure:**

- auth: Handles authentication and authorization.
- categories, sections: Manage product sections and categories.
- products: CRUD operations for products.
- orders: Manage order lifecycle.
- email: Manages email notifications.
- users, user-info: User profiles and additional information.

# 🛠️ Features

# User Roles and Permissions:

**Admin:**

- Perform CRUD operations on products, sections, and categories.
- Manage user roles (customer, admin, delivery person).
- View all registered orders.
- Cancel orders if needed.
- View analytics, including:
  - Total Sales
  - Orders
  - Customers
  - Average Order Value
- See a chart displaying orders by months in the current year.
- Delete registered user profiles.

**Delivery Person:**

- Mark orders as taken or delivered.

**Customer:**

- Make orders and pay with cash or card (save card details if needed).
- Cancel orders if they haven’t been taken.
- Receive email notifications for order registration or cancellation.
- View and edit profile information.
- Save and use delivery and payment details for future orders.

# E-Commerce Functionalities:

**Products:**

- Add products to favorites.
- Compare products.
- View products on sale with calculated discount.

**Orders:**

- Real-time status tracking.
- Order details including product list, address, quantity, and total cost.
- Notifications via email for order confirmation and cancellation.

**Gift Cards:**

- Customize and add gift cards to orders.

**Search:**

- Search bar in the navbar allows users to quickly search for products by name.
- Use an AI chatbot to search for specific products.

# Additional Features:

**Authentication:**

- User registration, login, and logout.
- Password reset functionality via email.
- Uses **JWT (JSON Web Tokens)** for secure authentication and authorization.
- Session management and token storage handled securely using **cookies**.

**Sections and Categories:**

- Categorized browsing for products (e.g., Electronics, Gaming, Accessories).

**Contact Form:**

- Allows users to send inquiries.

# 🛒 Shopping Cart

- **Product Display**: Shows added products with images, names, prices, quantities, and subtotal.
- **Quantity Management**: Adjust product quantity using "➕" and "➖" buttons with real-time updates.
- **Remove Products**: Easily remove items from the cart with a ❌ button.
- **Summary and Actions**:
  - View total price and cart summary.
  - **Continue Shopping** or proceed to **Checkout**.

# 📦 Database

- **PostgreSQL:**

  - Includes tables for users, products, orders, categories, sections, and more.
  - Complex relations between tables to support all the functionalities of the application.

# 📧 Email Notifications

- Users receive real-time email updates for order status and inquiries.

# 🚀 How to Run the Project

1. Clone the repository.
2. Navigate to the client and server directories and install dependencies using **npm install**.
3. Start the client and server:
   - Client: **npm run dev** (React app).
   - Server: **npm run start:dev** (NestJS app).
4. Initialize the database with Swagger APIs:
   - **/api/users/init-users**
   - **/api/sections/backfill**
5. Open the application in your browser.
