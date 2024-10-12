# Assignment Submission Portal

This is an Assignment Submission Portal where Users can register, log in, and submit assignments. Admins can register, login, view, accept, and reject assignments.



Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/atulkrs/assignment-submission-portal.git
   cd assignment-submission-portal

## Installation

step 1. npm install
step 2. npm install express
step 3. npm install mongoose
step 4. npm install dotenv
step 5. npm install body-parser



# Run this project

npm server.js

***Your project will start running on the localhost:5000***

# Testing Endpoints:

You can use Postman for testing Endpoints

- **USER ENDPOINTS:**

    - `POST /register` - Register a new user. 
       *** http://localhost:5000/api/users/register ***

        {
            "username" : "name",  // Replace with your actual name
            "password" : "yourpassword" // Replace with actual password
        }


    - `POST /login` - User login.
       *** http://localhost:5000/api/users/login ***


     
    - `POST /upload` - Upload an assignment.
       *** http://localhost:5000/api/users/assignments/upload ***

        {
            "userId": "67083a637fc902be75a88d87", // Replace with your actual UserId
            "task": "Your assignment task",
            "admin": "myadmin" // Replace with you actual Admin name
        }
         

    - `GET /admins`- fetch all admins
       *** http://localhost:5000/api/users/admins ***


- **Admin Endpoints:**
    - `POST /register` - Register a new admin.
       *** http://localhost:5000/api/admins/register ***

       {
            "username" : "name",  // Replace with your actual name
            "password" : "yourpassword" // Replace with actual password
        }
       

    - `POST /login` - Admin login.
       *** http://localhost:5000/api/admins/login ***


    - `GET /assignments` - View assignments tagged to the admin.
       *** http://localhost:5000/api/admins/assignments/admins/adminname(replace with actual admin name to whom you have uploaded) ***

       `GET /users` - fetch all users.
       *** http://localhost:5000/api/admins/users ***

    - `POST /assignments/:id/accept` - Accept an assignment.
       *** http://localhost:5000/api/admins/assignments/:id/accept ***


    - `POST /assignments/:id/reject` - Reject an assignment. 
       *** http://localhost:5000/api/admins/assignments/:id/reject ***



       ***#### Thankyou ####***