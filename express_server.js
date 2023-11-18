const express = require('express');
const {generateRandomString} = require('./functions');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  const templateVars = { urls : urlDatabase };
  res.render('urls_index', templateVars);
});

// route handler for /urls/new, it renders the create new tinyURL submission form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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

// when server receieve a post request /urls/:id/edit, go into urlDatabase to change the longURL
app.post("/urls/:id/edit", (req, res) => {
  // we have to get the updated longURL
  console.log(req.body);
  res.send('ok got the new longURL');
})
// :id is a route parameter, in this case is the shortURL
app.get("/urls/:id", (req, res) => {
  // req.params.id = shortenedURL
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

// route handler for /u/:id, when the shortenedURL is entered into browser, it redirects to the longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}!`);
});