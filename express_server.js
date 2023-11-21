const express = require('express');
const {generateRandomString} = require('./functions');
const {getUserByEmail} = require('./functions');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

// ----------------------------------------------------------
// ----------------------------------------------------------
// Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  // userRandomID: {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur",
  // },
  // user2RandomID: {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk",
  // },
};

// ----------------------------------------------------------
// ----------------------------------------------------------
// Route Handlers

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
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
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };

  res.render('urls_index', templateVars);
});

// route handler for /urls/new, it renders the create new tinyURL submission form
app.get("/urls/new", (req, res) => {
  
  const templateVars = {user: users[req.cookies["user_id"]]};
  res.render("urls_new", templateVars);
});

// route handler for /register
app.get("/register", (req, res) => {
  const templateVars = {user: users[req.cookies["user_id"]]};
  res.render("register", templateVars);
});

// handling POST requests to the "/urls" endpoint
app.post("/urls", (req, res) => {
  const shortenedURL = generateRandomString();

  // create a new entry in the urlDatabase with the shortenedURL as the key
  // pair key with longURL, req.body.longURL fetch the longURL user entered
  urlDatabase[shortenedURL] = req.body.longURL;
  res.redirect(`/urls/${shortenedURL}`);
});

// handling POST request for shortURL deletion
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// when server receieve a post request /urls/:id, go into urlDatabase to change the longURL
app.post("/urls/:id", (req, res) => {
  // update the shortURL value from old longURL to the new longURL user submitted through edit
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// post request to /login
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// route handler for post request to /register
app.post("/register", (req, res) => {
  const randomUserId = generateRandomString();
  
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  
  // if email or password is empty send back a statusCode 400
  if (userEmail.length === 0 || userPassword.length === 0) {
    res.status(400).send('Bad request, no email or password entered');
    return;
  }

  // check users object whether the email has been resgistered
  if (getUserByEmail(users, userEmail)) {
    // if function returns true, email has already been registered
    res.status(400).send('This email has already been registered, try using another email');
    return;
  }

  // create new user object
  users[randomUserId] = {
    id: randomUserId,
    email: userEmail,
    password: userPassword
  };
  console.log('users', users);

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

// route handler for /u/:id, when the shortenedURL is entered into browser, it redirects to the longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});
// ----------------------------------------------------------
// ----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}!`);
});