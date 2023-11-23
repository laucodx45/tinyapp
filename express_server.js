const express = require('express');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const {generateRandomString, getUserByEmail, urlsForUser} = require('./functions');
// Bug
// if user doesn't log out, it mess with the site** FIxed with session

const app = express();
const PORT = 8080;

// middleware
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['cookie']
}));

app.use(morgan('dev'));

app.set("view engine", "ejs");

// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// Database
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/*
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
*/
const users = {};

// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// Route Handlers
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// route handler for /urls
app.get("/urls", (req, res) => {
  // find randomId that can be used to access data in users Obj
  const loggedInUserId = req.session.user_id;
  
  // if user is not logged in
  if (!loggedInUserId) {
    // Return HTML with a relevant error message at GET /urls if the user is not logged in.???
    // i thought it should just redrect to login page, should i implement both??
    return res.redirect("/login");
  }
  
  // if cookie exist
  const templateVars = {
    user: users[loggedInUserId] || null,
    urls: urlsForUser(urlDatabase, loggedInUserId)
  };

  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const loggedInUserId = req.session.user_id;

  // If the user is not logged in, redirect GET /urls/new to GET /login
  if (!loggedInUserId) {
    res.redirect("/login");
    return;
  }

  const templateVars = {user: users[loggedInUserId]};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const loggedInUserId = req.session.user_id;

  // if user is logged in, GET /register should redirect to GET /urls
  if (loggedInUserId) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {user: users[loggedInUserId]};
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const loggedInUserId = req.session.user_id;

  // if user is logged in, GET /login should redirect to GET /urls
  if (loggedInUserId) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {user: users[loggedInUserId]};
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  const loggedInUserId = req.session.user_id;
  const longURL = req.body.longURL;

  // if user is not logged in, POST /urls should respond with an HTML message
  if (!loggedInUserId) {
    const htmlMessage = '<html><body><h1>Cannot shorten URL, user must login to use this feature</h1></body></html>';
    res.send(htmlMessage);
    return;
  }

  const shortenedURL = generateRandomString();

  // create a new entry in the urlDatabase with the shortenedURL as the key
  // pair key with longURL, req.body.longURL fetch the longURL user entered
  urlDatabase[shortenedURL] = { userID: loggedInUserId, longURL: longURL};
  res.redirect(`/urls/${shortenedURL}`);
});

// route handler for POST request to delete shortURL
app.post("/urls/:id/delete", (req, res) => {
  const loggedInUserId = req.session.user_id;
  const id = req.params.id;
  // should return a relevant error message if id does not exist
  if (!urlDatabase[id]) {
    res.status(404).send("Not Found: url entered is not in urlDatabase");
    return;
  }
  // should return a relevant error message if the user is not logged in
  if (!loggedInUserId) {
    res.status(400).send("Bad request: must login to delete URL");
    return;
  }
  // if user have at least one URL stored in urlDatabase
  if (urlsForUser(urlDatabase, loggedInUserId)) {
    // check if the shortendURL from params have userID that matches with loggedInUser, if it matches, user can delete url
    if (loggedInUserId === urlDatabase[id].userID) {
      delete urlDatabase[id];
      res.redirect("/urls");
      return;
    }
  }
  // user either have no URL stored or have url stored but they don't own it
  // we will return 403 at this point, they don't own that URL then
  res.status(403).send("Forbidden: user does not own the URL");
  return;
});

// post request to /urls/:id, request to change the longURL in urlDatabase
app.post("/urls/:id", (req, res) => {
  const loggedInUserId = req.session.user_id;

  // if id does not exist
  if (urlDatabase[req.params.id] === undefined) {
    res.status(404).send("This shortenURL does not exist in urlDatabase");
    return;
  }
  
  // if user is not logged in
  if (!loggedInUserId) {
    res.status(400).send("Bad request: user must login to edit");
    return;
  }

  if (urlDatabase[req.params.id].userID === loggedInUserId) {
    // update the shortURL value from old longURL to the new longURL user submitted through edit
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
    return;
  }

  res.status(403).send('Forbidden: user do not own this shortendURL');
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
    // bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword)
    if (bcrypt.compareSync(userPassword, users[id].password)) {
      req.session.user_id = id;
      res.redirect("/urls");
      return;
    }
  }
  // if email is not in database or password does not match the one in database
  res.status(403).send('Forbidden: Email not found in the database, or incorrect password.');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// post request to /register endpoint
app.post("/register", (req, res) => {
  const randomUserId = generateRandomString();
  
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(userPassword, 10);

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
    password: hashedPassword
  };

  // Set a cookie named "user_id" with the value of the user object associated with the randomly generated userID
  req.session.user_id = randomUserId;
  res.redirect("/urls");
});

// :id is a route parameter, in this case is the shortURL
app.get("/urls/:id", (req, res) => {
  // req.params.id = shortenedURL
  const loggedInUserId = req.session.user_id;

  const shortendURLuserOwn = urlsForUser(urlDatabase, loggedInUserId);

  // shortenURLuserOwn holds the shortendURL in urlDatabase that the userId owns
  // null = they don't own any URLS, no null = they own some but we'll check if they own :id
  if (shortendURLuserOwn === null || shortendURLuserOwn[req.params.id] === undefined) {
    res.status(401).send("unauthorized access: user do not own this URL");
    return;
  }

  const templateVars = {
    id: req.params.id,
    longURL: shortendURLuserOwn[req.params.id].longURL,
    user: users[loggedInUserId]
  };

  res.render("urls_show", templateVars);
});

// route handler for /u/:id, when the shortenedURL is entered into browser, it redirects user to the longURL
app.get("/u/:id", (req, res) => {
  const shortenedURL = req.params.id;

  // if the id does not exist at GET /u/:id

  // have to go into urlDatabase to check if the shortendURL exist
  const doesIdExist = urlDatabase[shortenedURL];

  if (!doesIdExist) {
    // Implement a relevant HTML error message
    const errorHtmlMessage = '<html><body><h1>Error, the shortenedURL does not exist in our dataBase</h1></body></html>';
    res.send(errorHtmlMessage);
    return;
  }

  const longURL = urlDatabase[shortenedURL].longURL;
  res.redirect(longURL);
});
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}!`);
});