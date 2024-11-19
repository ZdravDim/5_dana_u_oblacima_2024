var express = require('express');
const { addPlayer, getPlayer, getPlayers } = require('./player');
const { addTeam, getTeam } = require('./team');
const { addMatch } = require('./match');

var app = express();
app.use(express.json());

app.post('/players/create', function(req, res){
   player = addPlayer(req.body.nickname);
   if (player) {
      res.send(player);
   } else {
      res.status(400).send();
   }
});

app.get('/players', function(_req, res){
   res.send(getPlayers());
});

app.get('/players/:id', function(req, res){
   player = getPlayer(req.params.id);
   if (player) {
      res.send(player);
   } else {
      res.status(404).send();
   }
});

app.post('/teams', function(req, res){
   team = addTeam(req.body.teamName, req.body.players);
   if (team) {
      res.send(team);
   } else {
      res.status(404).send();
   }
});

app.get('/teams/:id', function(req, res){
   team = getTeam(req.params.id);
   if (team) {
      res.send(team);
   } else {
      res.status(404).send();
   }
});

app.post('/matches', function(req, res){
   matchOkay = addMatch(req.body.team1Id, req.body.team2Id, req.body.winningTeamId, req.body.duration);
   if (!matchOkay) res.status(404);
   res.send();
});

app.listen(8080);