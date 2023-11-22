const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {generateRandomString} = require('./functions');
const {getUserByEmail} = require('./functions');

const app = express();
const PORT = 8080;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.set("view engine", "ejs");

// ----------------------------------------------------------
// ----------------------------------------------------------
// Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

// ----------------------------------------------------------
// ----------------------------------------------------------
// Route Handlers
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// route handler for /urls
app.get("/urls", (req, res) => {
  // find randomId that can be used to access data in users Obj
  const userId = req.cookies["user_id"];
  
  // if cookie does not exist
  if (!userId) {
    return res.redirect("/login");
  }
  
  // if cookie exist
  const templateVars = {
    user: users[req.cookies["user_id"]] || null,
    urls: urlDatabase
  };

  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies["user_id"]]};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {user: users[req.cookies["user_id"]]};
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];

  // if user is logged in, GET /login should redirect to GET /urls
  if (userId) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {user: users[userId]};
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  const shortenedURL = generateRandomString();

  // create a new entry in the urlDatabase with the shortenedURL as the key
  // pair key with longURL, req.body.longURL fetch the longURL user entered
  urlDatabase[shortenedURL] = req.body.longURL;
  res.redirect(`/urls/${shortenedURL}`);
});

// route handler for POST request to delete shortURL
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// post request to /urls/:id, request to change the longURL in urlDatabase
app.post("/urls/:id", (req, res) => {
  // update the shortURL value from old longURL to the new longURL user submitted through edit
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  // req.body = {email: exampleEmail, password: examplePw}
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // if email or password is empty send back a statusCode 400
  if (userEmail.length === 0 || userPassword.length === 0) {
    res.status(400).send('Bad request, both email and password are required to login');
    return;
  }
  // if email entered in login is in users database
  if (getUserByEmail(users, userEmail)) {
    const id = getUserByEmail(users, userEmail);

    // check whether password in users obj match with the one user entered to login
    if (users[id].password === userPassword) {
      res.cookie("user_id", id);
      res.redirect("/urls");
      return;
    }
  }
  // if email is not in database or password does not match the one in database
  res.status(403).send('Forbidden: Email not found in the database, or incorrect password.');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

// post request to /register endpoint
app.post("/register", (req, res) => {
  const randomUserId = generateRandomString();
  
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  
  // if email or password is empty send back a statusCode 400
  if (userEmail.length === 0 || userPassword.length === 0) {
    res.status(400).send('Bad Request: Please provide both email and password.');
    return;
  }

  // check users object whether the email has been resgistered, if truthy
  if (getUserByEmail(users, userEmail)) {
    // if function returns true, email has already been registered
    res.status(400).send(`This email has already been registered. Please use a different email`);
    return;
  }

  // create new user object
  users[randomUserId] = {
    id: randomUserId,
    email: userEmail,
    password: userPassword
  };

  // Set a cookie named "user_id" with the value of the user object associated with the randomly generated userID
  res.cookie("user_id", randomUserId);
  res.redirect("/urls");
});

// :id is a route parameter, in this case is the shortURL
app.get("/urls/:id", (req, res) => {
  // req.params.id = shortenedURL
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]]
  };

  res.render("urls_show", templateVars);
});

// route handler for /u/:id, when the shortenedURL is entered into browser, it redirects user to the longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});
// ----------------------------------------------------------
// ----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}!`);
});