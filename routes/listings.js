const express = require("express");
const multer = require("multer");
const removeUploadedFiles = require("multer/lib/remove-uploaded-files");
const nodemailer = require("nodemailer");
const path = require("path");
const Article = require("../models/article");
const router = express.Router();
const fs = require("fs");
const { redirect } = require("express/lib/response");
const res = require("express/lib/response");

const storage = multer.diskStorage({
  destination: "./public/storage/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("imgURL");

router.get("/new-pic", (req, res) => {
  res.render("articles/new-pic");
});

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.post("/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.post("/uploader", (req, res) => {
  try{ 
    if (oldImgURL != "/storage/default.jpg") {
        if (fs.existsSync(`/public${oldImgURL}`)) {
          fs.unlinkSync(`/public${oldImgURL}`);
        }
      }
   }
   catch(e) {
     if(e.name == "ReferenceError") {
       oldImgURL = "/storage/default.jpg"
      }
    }  
    upload(req, res, (err) => {
      if (err) {
        res.redirect("new");
      } else {
      imgURL = `/storage/${req.file.filename}`;
      if (req.query.isNew == "new") {
        global.imgURL = imgURL
        res.redirect("new");
        return
                
      }
      res.redirect(`edit/${req.query.artID}?imgURL=${imgURL}`);
    }
  });
});

// Coding for contact form ;-)

router.post("/contact", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "mail.drakellc.com",
    port: 465,
    secure: true,
    auth: {
      user: "jdduck",
      pass: "6676-382",
    },
  });
  const mailOptions = {
    from: req.body.email,
    to: "jon@drakellc.com",
    subject: `Message from ${req.body.email}: ${req.body.subject}`,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Email sent: " + info.response);
      res.send("success");
    }
  });
});

router.get("/admin", async (req, res) => {
  const article = await Article.find();
  if (article == null) res.redirect("/");
  res.render("articles/admin", { article: article });
});

router.get("/mtg-calc", (req, res) => {
  res.render("articles/mtg-calculator");
});

router.get("/selling", (req, res) => {
  res.render("articles/selling");
});

router.get("/contact", (req, res) => {
  res.render("articles/contact");
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  article.imgURL = req.query.imgURL;
  res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

router.put("/:id", async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    imgURL = req.article.imgURL;
    next();
  },
  saveArticleAndRedirect("admin")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.imgURL = imgURL;
    article.address = req.body.address;
    article.headline = req.body.headline;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      console.log(e);
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
