# ShopEase Backend

This repository contains the backend code for ShopEase, an e-commerce platform. You can explore the project [here](https://shoppease.netlify.app/).

## Technology Used

- Node.js (Express)
- MongoDB
- Stripe payment
- SMTP mail service
- Authentication using JWT

## Local Environment Setup

To run the project in your local environment, follow these steps:

1. Clone the repository.
2. Create a config file in the root directory of the project.
3. Add the following environment variables to the config file:
     ```javascript
     PORT= // Add a port to run your project
     DB_URI= // Add MongoDB URL
     JWT_SECRET= // Add JWT secret
     JWT_EXPIRE= // Add JWT expiration time
     COOKIE_EXPIRE= // Add cookie expiration time 
     SMTP_SERVICE= // Add SMTP service (e.g., "gmail") 
     SMTP_MAIL= // Add your email for SMTP service 
     SMTP_PASSWORD= // Add SMTP password 
     SMTP_HOST= // Add SMTP host (e.g., smtp.gmail.com) 
     SMTP_PORT= // Add SMTP port 
     STRIPE_API_KEY= // Add Stripe API key 
     STRIPE_SECRET_KEY= // Add Stripe secret key
     ```
4. Make changes in `app.js`:
   - Uncomment the following line to load the config file:
     ```javascript
     dotenv.config({ path: "./config/config.env" });
     ```
   - Provide your frontend domain in the CORS options:
     ```javascript
     const corsOptions = {
         origin: 'http://localhost:3000', // Replace with your frontend domain (if running locally, use http://localhost:3000)
         credentials: true,
         optionSuccessStatus: 200
     }
     ```

5. Make changes in `server.js`:
   - Uncomment the following line to load the config file:
     ```javascript
     dotenv.config({ path: "./config/config.env" });
     ```

6. Make changes in `utilities.js`:
   - Remove the following three attributes from the options used to send cookies:
     ```javascript
     secure: true,
     sameSite: 'none',
     domain: 'shoppease.netlify.app'
     ```

## Running the Project

Follow these steps to run the project:

1. Make all the necessary changes mentioned above.
2. Run the following command to install the dependencies:
``$ npm install ``
3. Start the development server:
``$ npm run dev``
