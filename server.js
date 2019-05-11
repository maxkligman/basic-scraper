var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;


var app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/nprScraper", { useNewUrlParser: true });
process.env.NODE_ENV = 'production';


// scraping route
app.get("/scrape", function(req, res) {
  //  axios
  axios.get("https://www.npr.org/sections/news/").then(function(response) {
    var $ = cheerio.load(response.data);

    $(".item ").each(function(i, element) {
      //console.log(element);
      var result = {};
      result.title = $(element).find("a").text().trim()
      result.link =$(element).find("a").attr("href");
      result.image = $(element).find('img').attr('src');
      result.summary = $(element).find('.teaser').text().trim();
      console.log(result)
    
      // Add the text and href of every link, and save them as properties of the result object
      // result.title = $(this)
      //   .children("a")
      //   .text();
      // result.link = $(this)
      //   .children("a")
      //   .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

//  all Articles
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Article by id; populate with associated notes
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// saving/updating  Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      //associate with article
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
