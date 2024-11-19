const { expect } = require('chai');
const { addMatch } = require('./match');
const { clearPlayers, addPlayer, getPlayers } = require('./player');
const { clearTeams, addTeam } = require('./team');

describe('addPlayer', function() {
    
        beforeEach(function() {
            clearPlayers();
        });
    
        it('should return the player object if the player was added successfully', function() {
            const player = addPlayer('player1');
            expect(player).to.be.an('object');
            expect(player.nickname).to.equal('player1');
        });
    
        it('should return null if the player already exists', function() {
            addPlayer('player1');
            const player = addPlayer('player1');
            expect(player).to.be.null;
        });
});

describe('addTeam', function() {

    beforeEach(function() {
        clearPlayers();
        clearTeams();
    });

    it('should return the team object if the team was added successfully', function() {
        for (let i = 1; i <= 10; i++) addPlayer(`player${i}`);
        const players = getPlayers().map(player => player.id);
        const team = addTeam('team1', [players[0], players[1], players[2], players[3], players[4]]);
        expect(team).to.be.an('object');
        expect(team.teamName).to.equal('team1');
    });

    it('should return null if the team name already exists', function() {
        for (let i = 1; i <= 10; i++) addPlayer(`player${i}`);
        const players = getPlayers().map(player => player.id);
        addTeam('team1', [players[0], players[1], players[2], players[3], players[4]]);
        const team = addTeam('team1', [players[5], players[6], players[7], players[8], players[9]]);
        expect(team).to.be.null;
    });

    it('should return null if the players array is invalid', function() {
        for (let i = 1; i <= 10; i++) addPlayer(`player${i}`);
        const players = getPlayers().map(player => player.id);
        const team = addTeam('team1', [players[0], players[1], players[2], players[3]]);
        expect(team).to.be.null;
    });
});

describe('addMatch', function() {

    const add2Teams = () => {
        for (let i = 1; i <= 10; i++) addPlayer(`player${i}`);
        const players = getPlayers().map(player => player.id);
        const team1 = addTeam('team1', [players[0], players[1], players[2], players[3], players[4]]);
        const team2 = addTeam('team2', [players[5], players[6], players[7], players[8], players[9]]);
        return [team1.id, team2.id];
    }

    beforeEach(function() {
        clearPlayers();
        clearTeams();
    });

    it('should return false if any of the teams do not exist', function() {
        const result = addMatch('wrong id', 'wrong id', 'wrong id', 10);
        expect(result).to.be.false;
    });

    it('should return false if winningTeamId does not exist', function() {
        const teamIds = add2Teams();
        const result = addMatch(teamIds[0], teamIds[1], 'wrong id', 10);
        expect(result).to.be.false;
    });

    it('should return false if team1Id and team2Id are the same', function() {
        const teamIds = add2Teams();
        const result = addMatch(teamIds[0], teamIds[0], teamIds[1], 10);
        expect(result).to.be.false;
    });

    it('should return false if duration is less than 1', function() {
        const teamIds = add2Teams();
        const result = addMatch(teamIds[0], teamIds[1], teamIds[1], 0);
        expect(result).to.be.false;
    });

    it('should return true if the match was added successfully', function() {
        const teamIds = add2Teams();
        const result = addMatch(teamIds[0], teamIds[1], teamIds[1], 10);
        expect(result).to.be.true;
    });

    it('should return true if the match was a draw', function() {
        const teamIds = add2Teams();
        const result = addMatch(teamIds[0], teamIds[1], null, 10);
        expect(result).to.be.true;
    });
});