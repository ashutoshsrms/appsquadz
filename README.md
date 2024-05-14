# Nest JS User Management API

This is a simple RESTful API for managing user entries using nest.js And Mongodb.

## Setting Up

1. Clone the repository:

2. Navigate to the project directory:

3. Install dependencies:
   npm install

4. Set up environment variables:

- Create a `.env` file in the root directory.
- Define the following environment variables:
  ```
  MONGODB_URI=<your_mongodb_uri>
  JWT_SECRET=<your_jwt_secret>
  
  ```

## Running the API

Start the server: npm start

The server will start running on `http://localhost:3000` by default.

## API Endpoints

- **Users Api:**

  - Get All Users: `http://localhost:3000/users`
  - Get User by id: `http://localhost:3000/users/:id`
  - Update Book: `http://localhost:3000/users/:id`
  - Delete Book: `http://localhost:3000/users/:id`

- **Authentication:**
  - User Registration: ` http://localhost:3000/users/signup`
  - User Login: `http://localhost:3000/auth/login`
