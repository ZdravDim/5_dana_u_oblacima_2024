const { v4: uuidv4 } = require('uuid');
const { getPlayer } = require('./player');

/**
 * The teams database
 * @type {Map}
 * @property {string} teamId - The team's UUID
 * @property {Object} team - The team object
 * @property {string} team.id - The team's UUID
 * @property {string} team.teamName - The team's name
 * @property {Array} team.players - The team's players
 */
const teams = new Map();

/**
 * Generate a team ID
 * @returns {string}
 */
const generateTeamId = () => {
    let uuid = uuidv4();
    while (teams.has(uuid)) uuid = uuidv4();
    return uuid;
}

/**
 * Generate a team object
 * @param {string} teamName 
 * @returns {Object}
 */
const generateTeam = (teamName, players) => {
    const team = {
        id: generateTeamId(),
        teamName: teamName,
        players: [
            getPlayer(players[0]),
            getPlayer(players[1]),
            getPlayer(players[2]),
            getPlayer(players[3]),
            getPlayer(players[4]),
        ],
    };
    teams.set(team.id, team);
    return team;
}

/**
 * Validate the players array
 * @param {Array} players - The players array
 * @returns {boolean}
 * @returns {true} - If the players array is valid
 * @returns {false} - If the players array is invalid
 */
const validatePlayers = (players) => {
    if (players.length != 5) return false;
    for (let player of players) {
        const currentPlayer = getPlayer(player);
        if (!currentPlayer || currentPlayer.team) return false;
    }
    return true;
}

/**
 * Add a team to the database
 * @param {string} teamName - The name of the team
 * @param {Array} players - The players array
 * @returns {Object} - The team object
 * @returns {null} - If the team already exists or the players array is invalid
*/
exports.addTeam = (teamName, players) => {
    for (let team of teams.values()) {
        if (team.teamName === teamName) return null;
    }
    if (!validatePlayers(players)) return null;
    return generateTeam(teamName, players);
}

/**
 * Get a team from the database
 * @param {string} teamName - The name of the team
 * @returns {Object} - The team object
 * @returns {undefined} - If the team does not exist
 */
exports.getTeam = (teamName) => {
    return teams.get(teamName);
}