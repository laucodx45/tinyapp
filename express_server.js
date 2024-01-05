const express = require('express');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const {generateRandomString, getUserByEmail, urlsForUser} = require('./functions');
const methodOverride = require('method-override');

const app = express();
const PORT = 8080;

// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// Middleware
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['cookie']
}));

app.use(morgan('dev'));

app.set("view engine", "ejs");

app.use(methodOverride('_method'));
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// Database
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

const urlDatabase = {};
const users = {};

// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// Route Handlers
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

// GET route handler for /
app.get("/", (req, res) => {
  const loggedInUserId = req.session.user_id;

  // if user is not logged in
  if (!loggedInUserId) {
    res.redirect("/login");
    return;
  }
  // user is logged in
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const loggedInUserId = req.session.user_id;
  
  if (!loggedInUserId) {
    res.redirect("/login");
    return;
  }
  
  // if cookie exist
  const templateVars = {
    user: users[loggedInUserId],
    urls: urlsForUser(urlDatabase, loggedInUserId)
  };

  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const loggedInUserId = req.session.user_id;

  if (!loggedInUserId) {
    res.redirect("/login");
    return;
  }

  const templateVars = {user: users[loggedInUserId]};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const loggedInUserId = req.session.user_id;

  if (loggedInUserId) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {user: users[loggedInUserId]};
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const loggedInUserId = req.session.user_id;

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

  if (!loggedInUserId) {
    const htmlMessage = "<pre>Cannot shorten URL, user must login to use this feature</pre>";
    res.status(400).send(htmlMessage);
    return;
  }

  const shortenedURL = generateRandomString();

  // create a new entry in the urlDatabase with the shortenedURL as the key
  urlDatabase[shortenedURL] = { userID: loggedInUserId, longURL: longURL};
  res.redirect(`/urls/${shortenedURL}`);
});

// POST request to delete shortURL
app.delete("/urls/:id", (req, res) => {
  const loggedInUserId = req.session.user_id;
  const id = req.params.id;
  const urlsUserOwn = urlsForUser(urlDatabase, loggedInUserId);

  if (!loggedInUserId) {
    res.status(400).send("<pre>Bad request: must login to delete URL</pre>");
    return;
  }

  // user is logged in

  // if urlsUserOwn is truthy, if user doesn't own any, it returns null
  if (urlsUserOwn) {
    // check if the shortendURL from params have userID that matches with loggedInUser
    if (loggedInUserId === urlDatabase[id].userID) {
      delete urlDatabase[id];
      res.redirect("/urls");
      return;
    }
  }
  // user either have no URL stored or have url stored but they don't own it
  res.status(403).send("<pre>Forbidden: user does not own the URL</pre>");
});

// post request to change the longURL in urlDatabase
app.put("/urls/:id", (req, res) => {
  const loggedInUserId = req.session.user_id;
  const shortendURL = req.params.id;
  const newLongURL = req.body.longURL;

  if (!loggedInUserId) {
    res.status(400).send("<pre>Bad request: user must login to edit</pre>");
    return;
  }

  // user is logged in
  // if user own the shortenURL
  if (urlDatabase[shortendURL].userID === loggedInUserId) {
    // update the shortURL value from old longURL to the new longURL user submitted through edit
    urlDatabase[shortendURL].longURL = newLongURL;
    res.redirect("/urls");
    return;
  }
  // user do not own the shorten URL
  res.status(403).send("<pre>Forbidden: user do not own this shortendURL</pre>");
});

app.post("/login", (req, res) => {
  // req.body = {email: exampleEmail, password: examplePw}
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  
  // if email or password is empty send back a statusCode 400
  if (!userEmail || !userPassword) {
    res.status(400).send("<pre>Bad request, both email and password are required to login</pre>");
    return;
  }
  // if email entered in login is in users database
  if (getUserByEmail(users, userEmail)) {
    const id = getUserByEmail(users, userEmail);
    
    // check whether password in users obj match with the one user entered to login
    if (bcrypt.compareSync(userPassword, users[id].password)) {
      req.session.user_id = id;
      res.redirect("/urls");
      return;
    }
  }
  // if email is not in database or password does not match the one in database
  res.status(403).send("<pre>Forbidden: Email not found in the database, or incorrect password.</pre>");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const randomUserId = generateRandomString();
  
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(userPassword, 10);

  // if email or password is empty
  if (!userEmail.length || !userPassword) {
    res.status(400).send("<pre>Bad Request: Please provide both email and password.</pre>");
    return;
  }

  // check users object whether the email has been resgistered, if truthy
  if (getUserByEmail(users, userEmail)) {
    // if function returns a truthy value, email has already been registered
    res.status(400).send("<pre>This email has already been registered. Please use a different email</pre>");
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

app.get("/urls/:id", (req, res) => {
  const shortenURL = req.params.id;
  const loggedInUserId = req.session.user_id;

  if (!loggedInUserId) {
    res.status(401).send("<pre>Unauthorized: user must login first to view this page</pre>");
    return;
  }

  // if a URL for the given ID does not exist
  if (!urlDatabase[shortenURL]) {
    res.status(404).send("<pre>Not Found: shorten URL cannot be found in database</pre>");
    return;
  }
  
  const shortendURLuserOwn = urlsForUser(urlDatabase, loggedInUserId);

  // if user do not own shortURL, 401, if they own, check if they own this specific shortenURL
  if (!shortendURLuserOwn || !shortendURLuserOwn[shortenURL]) {
    res.status(401).send("<pre>unauthorized access: user do not own this URL</pre>");
    return;
  }

  const templateVars = {
    id: shortenURL,
    longURL: shortendURLuserOwn[shortenURL].longURL,
    user: users[loggedInUserId]
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortenedURL = req.params.id;

  // check if the shortendURL exist
  const doesIdExist = urlDatabase[shortenedURL];

  if (!doesIdExist) {
    res.status(404).send("<pre>Error, the shortenedURL does not exist in our dataBase</pre>");
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