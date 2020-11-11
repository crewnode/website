/**
 * ---------------------------------------------------
 * CrewNode
 * ---------------------------------------------------
 * @package  CrewNode
 * @author   Reece Benson <business@reecebenson.me>
 * @since    v0.0.1-alpha.1
 */
const Sequelize = require('sequelize');

module.exports = (app, models) => {

  /**
   * ---------------------------------------------------
   * @route   /api/server/push
   * @desc    Get the version of the launcher
   * @request GET
   * @access  Private
   */
  app.post('/api/server/push', async (req, res) => {
    // Check authorisation
    if (!('authorization' in req.headers)) {
      return res.status(403).json({ 'error': 'ACCESS_DENIED' });
    }

    // Check token
    const token = req.headers['authorization'];
    if (!token.includes('Bearer ')) {
      return res.status(403).json({ 'error': 'ACCESS_DENIED' });
    }

    // Check Bearer
    const bearer = token.replace('Bearer ', '');
    if (bearer != process.env.SERVER_AUTH_KEY) {
      return res.status(403).json({ 'error': 'ACCESS_DENIED' });
    }

    // Check type
    const data = req.body;
    console.log(data);
    if (!('packets' in data)) {
      console.log('invalid packet');
      return res.status(404).json({ error: 'INVALID_PACKET' });
    }

    // Iterate the packets
    let resp = {
      processed: [],
      dropped: [],
    };

    // TODO: Check for Instance ID in "data" for kubernetes sync
    // TODO: Update ORM models to respect instance id

    for (const v of data.packets) {
      console.log(v.type, v.data);
      switch (v.type.toLowerCase()) {
        // Game Handlers
        case 'gamenew': {
          const { creator, gameCode, gameMode, gameState } = v.data;
          if (!creator || !gameCode || !gameMode || !gameState) {
            resp['dropped'].push({...v.data, error: 'INVALID_DATA_' + v.type.toUpperCase()});
            continue;
          }

          // Validate Game Code
          if (gameCode.length != 4 && gameCode.length != 6) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAMECODE_' + v.type.toUpperCase()});
            continue;
          }

          // Create the game
          let _ = await models.Game.create({
            creator: creator,
            gameCode: gameCode,
            gameMode: gameMode,
            gameState: gameState
          });
          resp['processed'].push(v.data);
        }
        break;

        case 'gamesethost': {
          /* todo */
        }
        break;

        case 'gameupdate': {
          const { creator, gameCode, gameMode, gameState } = v.data;
          if (!creator || !gameCode || !gameMode || !gameState) {
            resp['dropped'].push({...v.data, error: 'INVALID_DATA_' + v.type.toUpperCase()});
            continue;
          }

          // Validate Game Code
          if (gameCode.length != 4 && gameCode.length != 6) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAMECODE_' + v.type.toUpperCase()});
            continue;
          }

          // Update existing game
          await models.Game.update(
            { creator: creator, gamecode: gameCode, gameMode: gameMode, gameState: gameState },
            { where: { gameCode: gameCode, creator: creator }
          });
          resp['processed'].push(v.data);
        }
        break;
        
        case 'gamedestroy': {
          const { creator, gameCode } = v.data;
          if (!creator || !gameCode) {
            resp['dropped'].push({...v.data, error: 'INVALID_DATA_' + v.type.toUpperCase()});
            continue;
          }

          // Validate Game Code
          if (gameCode.length != 4 && gameCode.length != 6) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAMECODE_' + v.type.toUpperCase()});
            continue;
          }

          // Delete game
          await models.Game.destroy(
            { where: { gameCode: gameCode, creator: creator },
            limit: 1
          });
          resp['processed'].push(v.data);
        }
        break;
  
        // Player Handlers
        case 'playeradd': {
          const { gameCode, playerName, playerColor, playerSkin, playerHat, playerPet, playerPosX, playerPosY, ipAddress, discordUid } = v.data;
          if (!gameCode || !playerName || playerColor == null || playerSkin == null || playerHat == null || playerPet == null || !playerPosX || !playerPosY || !ipAddress) {
            resp['dropped'].push({...v.data, error: 'INVALID_DATA_' + v.type.toUpperCase()});
            continue;
          }

          // Validate Game Code
          if (gameCode.length != 4 && gameCode.length != 6) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAMECODE_' + v.type.toUpperCase()});
            continue;
          }

          // Find the game this player is in
          let game = await models.Game.findOne({ where: { gameCode: gameCode } });
          if (!game) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAME_' + v.type.toUpperCase()});
            continue;
          }

          // Create the player
          await models.GamePlayer.create({
            gameId: game.id,
            playerName: playerName,
            playerColor: playerColor,
            playerSkin: playerSkin,
            playerHat: playerHat,
            playerPet: playerPet,
            playerPosX: playerPosX,
            playerPosY: playerPosY,
            ipAddress: ipAddress,
            discordUid: discordUid ? discordUid : null
          });
          resp['processed'].push(v.data);
        }
        break;

        case 'playerupdate': {
          const { gameCode, playerName, playerColor, playerSkin, playerHat, playerPet, playerPosX, playerPosY, ipAddress, discordUid } = v.data;
          if (!gameCode || !playerName || playerColor == null || playerSkin == null || playerHat == null || playerPet == null || !playerPosX || !playerPosY || !ipAddress) {
            resp['dropped'].push({...v.data, error: 'INVALID_DATA_' + v.type.toUpperCase()});
            continue;
          }

          // Validate Game Code
          if (gameCode.length != 4 && gameCode.length != 6) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAMECODE_' + v.type.toUpperCase()});
            continue;
          }

          // Find the game this player is in
          let game = await models.Game.findOne({ where: { gameCode: gameCode } });
          if (!game) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAME_' + v.type.toUpperCase()});
            continue;
          }

          // Update the player
          await models.GamePlayer.update(
            {
              gameId: game.id,
              playerName: playerName,
              playerColor: playerColor,
              playerSkin: playerSkin,
              playerHat: playerHat,
              playerPet: playerPet,
              playerPosX: playerPosX,
              playerPosY: playerPosY,
              ipAddress: ipAddress,
              discordUid: discordUid ? discordUid : null
            },
            { where: { gameCode: gameCode, playerName: playerName, ipAddress: ipAddress } }
          );
          resp['processed'].push(v.data);
        }
        break;

        case 'playerremove':  {
          const { gameCode, playerName, ipAddress } = v.data;
          if (!gameCode || !playerName || !ipAddress) {
            resp['dropped'].push({...v.data, error: 'INVALID_DATA_' + v.type.toUpperCase()});
            continue;
          }

          // Validate Game Code
          if (gameCode.length != 4 && gameCode.length != 6) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAMECODE_' + v.type.toUpperCase()});
            continue;
          }

          // Find the game this player is in
          let game = await models.Game.findOne({ where: { gameCode: gameCode } });
          if (!game) {
            resp['dropped'].push({...v.data, error: 'INVALID_GAME_' + v.type.toUpperCase()});
            continue;
          }

          // Remove the player
          await models.GamePlayer.destroy(
            { where: { gameId: game.id, playerName: playerName, ipAddress: ipAddress },
            limit: 1
          });
          resp['processed'].push(v.data);
        }
        break;
        
        // Fallback
        default:
          resp = { error: 'INVALID_TYPE',  };
          break;
      }
    }

    if (resp.length == 0) {
      return res.status(404).json({ error: 'UNKNOWN' });
    }

    return res.status(200).json(resp);
  });

};