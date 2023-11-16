const express = require('express');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    const charactersLength = characters.length;

    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
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

// new route to render the submission form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const shortenedURL = generateRandomString();

  // create a new shortenedURL key with value of the longURL in urlDataBase
  urlDatabase[shortenedURL] = req.body.longURL;
  
  res.redirect(`http://localhost:8080/urls/${shortenedURL}`);
  
});

// :id is a route parameter that captures the value from the URL
app.get("/urls/:id", (req, res) => {
  // id is the shortened url, we can fetch longURL by using value of req
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});


app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}!`);
});