$(document).ready(function() {

  function postAwaySRS(away_code) {
    $.get("/api/asrs/" + away_code, function(data) {
      console.log(data);
    })
  }

  function postHomeSRS(home_code) {
    $.get("/api/hsrs/" + home_code, function(data) {
      console.log(data);
    })
  }

  function postSchedule() {
    console.log("yes")
    $.get("/api/schedule/", function(data) {
      console.log(data);
      /*
      for (var i = 0; i < data.length; i++) {
        postAwaySRS(data[i].away_code);
        postHomeSRS(data[i].home_code);
      }
      */
    }).done(function() {
      getGames();
    })
  }

  function getGames() {
    $.get("/api/games/", function(data) {
      console.log("Games", data);
      createTable(data);
    });
  }

  postSchedule();

  function createTable(data) {
    $("#table-body").empty();
    var tableRows = [];

    for (var i = 0; i < data.length; i++) {
      var date = "<td>" + data[i].date + "</td>";
      var kickoff = "<td>" + data[i].kickoff + "</td>";
      var away = "<td>" + data[i].away + "</td>";
      var aSpread = "<td>" + data[i].away_line + "</td>";
      var aSRS = "<td>" + data[i].away_SRS + "</td>";
      var home = "<td>" + data[i].home + "</td>";
      var hSpread = "<td>" + data[i].home_line + "</td>";
      var hSRS = "<td>" + data[i].home_SRS + "</td>";

      var homeSTR = data[i].home_SRS + 2.5;
      var homePre = data[i].away_SRS - homeSTR;

      var difference = data[i].home_line - homePre;
      console.log("difference: ", difference);
      if (difference > 2.5) {
        var bet = "<td class='betting'>" + data[i].home + "</td>";
      } else if (difference < -2.5) {
        var bet = "<td class='betting'>" + data[i].away + "</td>";
      } else {
        var bet = "<td class='no-bet'>none</td>";
      }

      var rowData = date + kickoff + away + aSpread + aSRS + home + hSpread + hSRS + bet;
      var row = "<tr>" + rowData + "</tr>";

      tableRows.push(row);
    }
    $("#table-body").append(tableRows);
  }

});
