const express = require('express');

const app = express();
const PORT = 8080;

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

// new route handler for /url
app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// :id is a route parameter that captures the value from the URL
app.get("/urls/:id", (req, res) => {
  // id is the shortened url, we can fetch longURL by using value of req
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}!`);
});