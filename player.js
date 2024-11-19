const { v4: uuidv4 } = require('uuid');

/**
 * The players database
 * @type {Map}
 * @property {string} playerId - The player's UUID
 * @property {Object} player - The player object
 * @property {string} player.id - The player's UUID
 * @property {string} player.nickname - The player's nickname
 * @property {number} player.wins - The player's wins
 * @property {number} player.losses - The player's losses
 * @property {number} player.elo - The player's ELO
 * @property {number} player.hoursPlayed - The player's hours played
 * @property {string} player.team - The player's team
 * @property {string} player.ratingAdjustment - The player's rating adjustment
 */
const players = new Map();

/**
 * Generate a player ID
 * @returns {string}
 */
const generatePlayerId = () => {
    let uuid = uuidv4();
    while (players.has(uuid)) uuid = uuidv4();
    return uuid;
}

/**
 * Generate a player object
 * @param {string} nickname 
 * @returns {Object}
 */
const generatePlayer = (nickname) => {
    const player = {
        id: generatePlayerId(),
        nickname: nickname,
        wins: 0,
        losses: 0,
        elo: 0,
        hoursPlayed: 0,
        team: null,
        ratingAdjustment: null
    };

    players.set(player.id, player);
    return player;
}

/**
 * Add a player to the database
 * @param {string} nickname - The nickname of the player
 * @returns {Object} - The player object
 * @returns {null} - If the player already exists
 */
exports.addPlayer = (nickname) => {
    for (let player of players.values()) {
        if (player.nickname === nickname) return null;
    }
    return generatePlayer(nickname);
}

/**
 * Get all players from the database
 * @returns {Array} - An array of player objects
 */
exports.getPlayers = () => {
    return Array.from(players.values());
}

/**
 * Get a player from the database
 * @param {string} playerId - The UUID of the player
 * @returns {Object} - The player object
 * @returns {undefined} - If the player does not exist
*/
exports.getPlayer = (playerId) => {
    return players.get(playerId);
}

/**
 * Clear the players database
 * @returns {void}
 */
exports.clearPlayers = () => {
    players.clear();
}