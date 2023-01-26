const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Article = require("./models/article");
const articleRouter = require("./routes/listings");
const methodOverride = require("method-override");
const nodemailer = require("nodemailer");
const compression = require("compression")
const helmet = require("helmet")

const PORT = process.env.PORT || 5000;


// connect via cloud atlas

// const db = mongoose.connect("mongodb+srv://jon:ducksDux283@cluster0.ssob2rk.mongodb.net/listings");

// local connection

const db = mongoose.connect("mongodb://127.0.0.1:27017/listings");

app.use(compression()); //compress all routes
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.json());

global.imgURL = ""

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(PORT);
console.log("Server Started....");
