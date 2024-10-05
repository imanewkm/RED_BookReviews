# **Book Review Fullstack Application**

## **Project Overview**

This is a full-stack web application designed for users to submit and browse book reviews. Users can provide detailed feedback on various aspects of a book, including setting, plot, characters, style, and engagement. The app also allows users to rate books, upload book cover images, and share their favorite quotes or memorable moments.

The frontend is built using **React.js** for a dynamic user interface, while the backend uses **Node.js** with **Express.js** for handling server-side logic and API requests.

## **Features**

- **User Book Review Submission:**
  - Users can submit book reviews by entering the book title, rating different aspects, adding text-based thoughts, and uploading a book cover image.
  
- **Star Ratings:**
  - 5-star rating system for different book aspects such as plot, setting, and characters.
  
- **Review Display:**
  - Each review page displays the book cover, user ratings, and their detailed thoughts.

- **Mobile-Responsive Design:**
  - The UI is responsive and adjusts for mobile, tablet, and desktop viewports.

## **Technologies Used**

### **Frontend (React.js)**
- **React.js**: A JavaScript library for building user interfaces.
- **CSS**: Styling for components and pages.
- **Axios**: For making HTTP requests from the frontend to the backend API.

### **Backend (Node.js/Express.js)**
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: A web framework for building API routes.


### **Third-Party Services**
- **Google Books API**: (Optional) for fetching book metadata.
- **Cloudinary**: (Optional) for storing book cover images.

## **Installation and Setup**

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-review-app.git
   cd book-review-app/server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables:
   - Define variables like:
     - Any third-party API keys (Google Books, Cloudinary, etc.).

4. Run the backend server:
   ```bash
   npm start
   ```

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd ../client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Run the React development server:
   ```bash
   npm start
   ```

The React app should now be running at `http://localhost:3000`, while the backend runs on `http://localhost:5000` 

## **Learning Objectives**
- Building a full-stack application using **React.js** and **Node.js/Express.js**.
- Handling form submissions and managing state with **React**.
- Creating RESTful APIs with **Express.js** and connecting to a database with **MongoDB**.
- Implementing user authentication (optional) and integrating third-party APIs.

## **Challenges Identified**
- Handling large image uploads and managing storage (optional Cloudinary integration).
- Implementing a flexible and reusable form for different book attributes.
- Efficiently querying and displaying book reviews.

## **Future Improvements**
- **User Authentication**: Add login functionality to allow users to create accounts and track their reviews.
- **Search and Filter**: Implement features to search books and filter reviews by genre, rating, etc.
- **Admin Dashboard**: Add an admin panel for managing reviews and users.
