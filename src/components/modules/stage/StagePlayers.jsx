import { StageCharacter } from './characters/StageCharacter';
import React, { useEffect, useState } from 'react';

const StagePlayers = ({ cellSize, players }) => {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    if (players) {
      const newCharacters = players.map((player) => {
        const character = new StageCharacter(
          player.id,
          player.x,
          player.y,
          player.state,
          player.direction,
          player.inventory,
          player.playerCodes,
        );
        return character;
      });
      setCharacters(newCharacters);
    }
  }, [players]);

  return (
    <div className='stage-players'>
      {characters.map((player, index) => {
        const leftValue = player.x * cellSize.width;
        const topValue = player.y * cellSize.height;
        const playerSize = cellSize.width * 0.6; // Assuming player occupies 80% of the cell

        const getImage = player.getImage();
        return (
          <div
            key={index}
            className='stage-player'
            style={{
              position: 'absolute',
              left: leftValue, // Assuming 32px grid
              top: topValue,
              width: cellSize.width,
              height: cellSize.height,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
            }}
          >
            {typeof getImage === 'string' ? (
              <img
                src={getImage}
                alt={player.id}
                style={{
                  width: playerSize,
                  height: playerSize,
                }}
              />
            ) : (
              <div
                style={{
                  ...getImage.style,
                  width: playerSize,
                  height: playerSize,
                }}
              >
                {getImage.text}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StagePlayers;
