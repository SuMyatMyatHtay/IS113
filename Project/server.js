const path = require("path");
const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const auth = require("./routes/auth");
const movie = require("./routes/movie");
const review = require("./routes/review");
app.use("/", auth);
app.use("/", movie);
app.use("/", review);

app.get("/", (req, res) => {
  res.send(`
    <h1>Movies Watchlist</h1>
    <a href="signup">Sign Up</a>
    <a href="login">Login</a>
  `);
});

const hostname = "127.0.0.1";
const port = 8000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});