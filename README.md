# Airbnb Travel Stays

## Description
**Airbnb Travel Stays** is a full-stack web application that allows users to search, book, and manage stays at different travel locations. The platform provides users with the ability to create, view, update, and delete listings, as well as manage reviews and ratings. It includes user authentication and image upload functionalities, providing a comprehensive travel booking experience similar to Airbnb.

## Major Parts

### 1. **User Authentication**
- **Signup, Login, and Logout**: Implemented using Passport.js with local strategy.
- **Session Management**: Ensures secure user sessions, allowing users to stay logged in and manage their profiles.
  
### 2. **Listings Management**
- **Create, Update, Delete Listings**: Users can add new travel listings with details like title, description, price, location, etc.
- **Image Upload**: Users can upload images for each listing, stored on Cloudinary for efficient media management.

### 3. **Search and Filtering**
- **Search Functionality**: Allows users to search for listings based on various criteria such as location, price, and type of accommodation.
- **Filtering**: Provides filtering options to narrow down results based on user preferences (e.g., price range, amenities, etc.).

### 4. **Reviews and Ratings**
- **Submit Reviews**: Users can leave reviews for listings they've stayed at, including a star rating system.
- **Manage Reviews**: Users can edit or delete their reviews.

### 5. **Add your own listing System**
- **Availability and Booking**: Users can add listings and show them to the main page.

### 6. **Authorization and Ownership**
- **Owner-Specific Features**: Only the owner of a listing can edit or delete it. Similarly, only the person who posted a review can edit or delete it.
- **Admin Role**: Admin users can manage all listings and reviews across the platform.

### 7. **Responsive User Interface**
- **Bootstrap**: Fully responsive design to ensure a smooth experience on mobile and desktop.
- **Custom CSS**: Tailored styles for a more polished and modern look.
  
### 8. **Error Handling and Flash Messages**
- **Form Validation**: Proper error handling for invalid form inputs, with feedback provided to users through flash messages.
- **Database Errors**: Error handling for database queries, especially during listing creation, review submission, and user authentication.

## Tech Stack
- **Frontend**: HTML, EJS, CSS (Bootstrap, custom styles)
- **Backend**: Node.js, Express.js, Passport.js (authentication)
- **Database**: MongoDB (with Mongoose ORM)
- **File Storage**: Cloudinary (for image storage)
- **Authentication**: Passport.js with local strategy

## Dependencies

Here are the installed dependencies for the project:

- `express` – Web framework for Node.js.
- `mongoose` – MongoDB object modeling tool.
- `passport` – Authentication middleware for Node.js.
- `passport-local` – Local authentication strategy for Passport.js.
- `express-session` – Session middleware to manage user login states.
- `cloudinary` – Cloud storage solution for storing images.
- `ejs` – Templating engine for rendering HTML.
- `dotenv` – Loads environment variables from `.env` file.
- `connect-flash` – Flash messaging middleware for Express.
- `multer` – Middleware for handling multipart/form-data, used for file uploads.
- `bcryptjs` – Library to hash passwords for secure storage.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Khairul2556/airbnb-travel-stays.git

2. Install dependencies:

```bash
   cd airbnb-travel-stays
    npm install
```

3. Set up environment variables for the database and Cloudinary.

4. Run the application:
```bash
npm start
```
5. Visit the app in your browser at http://localhost:8080/listings

## Routes Overview

- /listings – Home page displaying a list of all travel stays.
- /listings/new – Form to create a new listing.
- /listings/:id – View details of a specific listing.
- /listings/:id/edit – Edit an existing listing.
- /reviews/:listingId – Submit a review for a listing.
- /login – Login page.
- /signup – Signup page.
- /profile – User profile to manage bookings and account settings

## Future Improvements
- Search Filters: Enhance the search functionality with more advanced filters (e.g., amenities, type of property).

- Payment Gateway Integration: Add a payment system for booking confirmations.

- Admin Panel: Create a dedicated admin dashboard to manage users and listings.




