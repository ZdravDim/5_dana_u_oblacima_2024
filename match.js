const { getTeam } = require("./team");

/**
 * Validate the team ids.
 * @param {string} team1Id - The id of the first team.
 * @param {string} team2Id - The id of the second team.
 * @param {string} winningTeamId - The id of the winning team.
 * @returns {boolean} - True if the team exists and ids are valid, false otherwise.
 */
const validateTeamIds = (team1Id, team2Id, winningTeamId) => {
    if (team1Id === team2Id || !getTeam(team1Id) || !getTeam(team2Id)) return false;
    if (winningTeamId) {
        if (!getTeam(winningTeamId)) return false;
        if (team1Id !== winningTeamId && team2Id !== winningTeamId) return false;
    }
    return true;
}

const updateStatistics = (team1Id, team2Id, winningTeamId, duration) => {
    
}

/**
 * Add a match to the statistics.
 * @param {string} team1Id - The id of the first team.
 * @param {string} team2Id - The id of the second team.
 * @param {string} winningTeamId - The id of the winning team.
 * @param {number} duration - The duration of the match.
 * @returns {boolean} - True if the match was added successfully, false otherwise.
 */
exports.addMatch = (team1Id, team2Id, winningTeamId, duration) => {
    if (!validateTeamIds(team1Id, team2Id, winningTeamId)) return false;
    if (duration < 1) return false;
    updateStatistics(team1Id, team2Id, winningTeamId, duration);
    return true;
};