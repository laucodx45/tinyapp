# Tiny App

TinyApp is a full-stack web application built with Node.js and Express.js, offering users a seamless experience in shortening and managing URLs, reminiscent of services like bit.ly. This application allows users to create accounts, ensuring their shortened URLs persist even after closing the website. 

## Key Features: 

- User-Friendly Interface
  - Created with EJS for dynamic content rendering, CSS for styling, and JavaScript for enhanced interactivity, ensuring an intuitive and engaging user experience.

- URL Shortening Logic
  - Server-side logic for generating and managing short URLs seamlessly.

- User Account Management UI
  - Intuitive pages for registration, login and logout.

- RESTful API Endpoints
  - Define endpoints for creating and retrieving short URLs with user authentication.

- Middleware Functions
  - Implement middleware for tasks like managing sessions.

- Error Handling
  - Comprehensive error handling, including status codes and informative error messages.

## Security Features:

- Hashed Passwords
  - User passwords are securely hashed, adding an extra layer of protection against unauthorized access.

- Cookie Encryption
  - Session cookies, containing sensitive user authentication data, are encrypted to safeguard against potential interception and unauthorized tampering.

- URL Ownership Protection
  - Users are granted exclusive ownership rights over the short URLs they create. This ensures that each user can only edit or delete the short URLs associated with their account.

## Final Product

!["screen shot of the login page in tinyapp"](https://github.com/laucodx45/tinyapp/blob/master/docs/login-page.png?raw=true)
![screen shot of the create new URL page in tinyapp](https://github.com/laucodx45/tinyapp/blob/master/docs/createTinyURL-page.png?raw=true)
![screen shot of the shortURL created by user](https://github.com/laucodx45/tinyapp/blob/master/docs/shortenURL.png?raw=true)
![screen shot of the list of shortend URL created by user](https://github.com/laucodx45/tinyapp/blob/master/docs/urls-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Enter http://localhost:8080/register to browser to create an account in order to use TinyApp