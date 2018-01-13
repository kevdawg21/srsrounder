// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var request = require("request");
var cheerio = require("cheerio");

// Requiring our Todo model
var db = require("../models");

var fullTeam = ["Arizona", "Atlanta", "Baltimore", "Buffalo", "Carolina", "Chicago", "Cincinnati", "Cleveland", "Dallas", "Denver", "Detroit", "Green Bay", "Houston", "Indianapolis", "Jacksonville", "Kansas City", "L.A. Chargers", "L.A. Rams", "Miami", "Minnesota", "New England", "New Orleans", "N.Y. Giants", "N.Y. Jets", "Oakland", "Philadelphia", "Pittsburgh", "San Francisco", "Seattle", "Tampa Bay", "Tennessee", "Washington"];
var codeTeam = ["crd", "atl", "rav", "buf", "car", "chi", "cin", "cle", "dal", "den", "det", "gnb", "hou", "clt", "jax", "kan", "sdg", "ram", "mia", "min", "nwe", "nor", "nyg", "njy", "rai", "phi", "pit", "sfo", "sea", "tam", "oti", "was"];

function codeTeams(teamName) {
  var index = fullTeam.indexOf(teamName);
  var code = codeTeam[index];

  return code;
}

// Routes
// =============================================================
module.exports = function(app) {

  app.get("/api/games/", function(req, res) {
    db.Game.find({})
    .then(function(dbPost) {
      res.json(dbPost);
    });
  });

  app.get("/api/schedule/", function(req, res) {
    db.Game.deleteMany({}).then(function() { 
      request("https://www.sportsbookreview.com/betting-odds/consensus/", function(error, response, html) {

        var $ = cheerio.load(html);

        $(".status-scheduled").each(function(i, element) {
          var game = {
            date: "",
            kickoff: "",
            away_team: "",
            away_code: "",
            away_line: "",
            home_team: "", 
            home_code: "",
            home_line: ""
          }
          game.away_team = $(element).children(".eventLine-team").children().first().children(".team-name").children("a").text();
          game.away_code = codeTeams(game.away_team);
          game.home_team = $(element).children(".eventLine-team").children().last().children(".team-name").children("a").text();
          game.home_code = codeTeams(game.home_team);
          rawDate = $(element).parent().parent().parent().prev().children().children().children().text();
          game.date = rawDate.replace("#Time/TV", "").trim();
          game.kickoff = $(element).children(".eventLine-time").children().text();
          rawAwayLine = $(element).children(".eventLine-currentLine").children().first().text();
          rawAwayHalf = rawAwayLine.includes("½");
          if (rawAwayHalf) {
            rawAwayLine = rawAwayLine.replace("½", ".5");
            console.log(rawAwayLine);
            game.away_line = rawAwayLine.slice(0, 4).trim();
          } else {
            game.away_line = rawAwayLine.slice(0, 3).trim();
          }
          rawHomeLine = $(element).children(".eventLine-currentLine").children().last().text();
          rawHomeHalf = rawHomeLine.includes("½");
          if (rawHomeHalf) {
            rawHomeLine = rawHomeLine.replace("½", ".5");
            console.log(rawHomeLine);
            game.home_line = rawHomeLine.slice(0, 4).trim();
          } else {
            game.home_line = rawHomeLine.slice(0, 3).trim();
          }

          if (game.away_team === "Atlanta") {
            game.away_SRS = 4.26;
          }

          if (game.away_team === "Jacksonville") {
            game.away_SRS = 6.54;
          }

          if (game.away_team === "Tennessee") {
            game.away_SRS = -3.5;
          }

          if (game.away_team === "New Orleans") {
            game.away_SRS = 9.17;
          }

          if (game.home_team === "Philadelphia") {
            game.home_SRS = 9.4;
          }

          if (game.home_team === "Pittsburgh") {
            game.home_SRS = 5.03;
          }

          if (game.home_team === "New England") {
            game.home_SRS = 8.89;
          }

          if (game.home_team === "Minnesota") {
            game.home_SRS = 9.12;
          }

          
          console.log(game);

          if (game.kickoff) {
            db.Game.create({
              date: game.date,
              kickoff: game.kickoff,
              away: game.away_team,
              away_code: game.away_code,
              away_SRS: game.away_SRS,
              away_line: game.away_line,
              home: game.home_team, 
              home_code: game.home_code,
              home_SRS: game.home_SRS,
              home_line: game.home_line
            }).then(function(data) {
              res.redirect("/");
            })
          }
        })
      });
    });
  });
  
  app.get("/api/asrs/:code", function(req, res) {
    request("https://www.pro-football-reference.com/teams/" + req.params.code + "/2017.htm", function(error, response, html) {

      var $ = cheerio.load(html);

      $(".prevNext").each(function(i, element) {
        SRS = $(element).next().next().next().next().next().next().children().text();
        db.Game.findOneAndUpdate({away_code: away }, { $push: { away_SRS: SRS } }, { new: true });
        console.log(SRS);
      })

    })
  })

  app.get("/api/hsrs/:code", function(req, res) {
    request("https://www.pro-football-reference.com/teams/" + req.params.code + "/2017.htm", function(error, response, html) {

      var $ = cheerio.load(html);

      $(".prevNext").each(function(i, element) {
        SRS = $(element).next().next().next().next().next().next().children().text();
        db.Game.findOneAndUpdate({home_code: away }, { $push: { home_SRS: SRS } }, { new: true });
        console.log(SRS);
      })

    })
  })
};
