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

/**
 * Calculate the player rating.
 * @param {number} hours - The player's hours played.
 * @returns {number} - The player rating.
 */
const calculatePlayerRating = (hours) => {
    if (hours < 500) return 50;
    if (hours >= 500 && hours < 1000) return 40;
    if (hours >= 1000 && hours < 3000) return 30;
    if (hours >= 3000 && hours < 5000) return 20;
    return 10;
}

/**
 * Calculate the expected ELO rating.
 * @param {number} R1 - The first player's ELO rating.
 * @param {number} R2 - The second player's ELO rating.
 * @returns {number} - The expected ELO rating.
 */
const calculateExpectedELO  = (R1, R2) => {
    return 1 / (1 + Math.pow(10, (R2 - R1) / 400));
}

/**
 * Calculate the new ELO rating.
 * @param {number} R1 - The first player's ELO rating.
 * @param {number} R2 - The second player's ELO rating.
 * @param {number} K - The player rating.
 * @param {number} S - The match result.
 * @returns {number} - The new ELO rating.
 */
const calculateNewELO = (R1, R2, K, S) => {
    const E = calculateExpectedELO (R1, R2);
    return R1 + K * (S - E);
}

/**
 * Update team statistics
 * @param {string} teamId - The id of the team.
 * @param {string} status - The status of the match.
 * @param {number} duration - The duration of the match.
 * @returns {void}
 */
const updateTeamStatistics = (teamId, S, duration, R2) => {
    const team = getTeam(teamId);
    for (let player of team.players) {
        player.hoursPlayed += duration;
        if (S == 1) player.wins++;
        else if (S == 0) player.losses++;
        player.ratingAdjustment = calculatePlayerRating(player.hoursPlayed);
        player.elo = calculateNewELO(player.elo, R2, player.ratingAdjustment, S);
    }
}

/**
 * Get the match result.
 * @param {string} teamId - The id of the team.
 * @param {string} winningTeamId - The id of the winning team.
 * @returns {number} - The match result, which can be:
 *  - 1 If the team won.
 *  - 0 If the team lost.
 *  - 0.5 If the match was a draw.
 */
const getMatchResult = (teamId, winningTeamId) => {
    if (winningTeamId) {
        if (teamId === winningTeamId) return 1;
        return 0;
    }
    return 0.5;
}

/**
 * Calculate the team's ELO rating.
 * @param {string} teamId - The id of the team.
 * @returns {number} - The team's ELO rating.
 */
const calculateTeamELO = (teamId) => {
    const team = getTeam(teamId);
    let R = 0;
    for (let player of team.players) {
        R += player.elo;
    }
    return R / 5;
}

/**
 * Update both team's statistics.
 * @param {string} team1Id - The id of the first team.
 * @param {string} team2Id - The id of the second team.
 * @param {string} winningTeamId - The id of the winning team.
 * @param {number} duration - The duration of the match.
 * @returns {void}
 */
const updateStatistics = (team1Id, team2Id, winningTeamId, duration) => {
    const R1 = calculateTeamELO(team1Id);
    const R2 = calculateTeamELO(team2Id);
    updateTeamStatistics(team1Id, getMatchResult(team1Id, winningTeamId), duration, R2);
    updateTeamStatistics(team2Id, getMatchResult(team2Id, winningTeamId), duration, R1);
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