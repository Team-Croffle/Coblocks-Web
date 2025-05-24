import { StageCharacterFactory } from './characters/StageCharacterFactory';
import React, { useEffect, useState } from 'react';

const StagePlayers = ({ cellSize, players }) => {
  const [characterFactory] = useState(() => new StageCharacterFactory());

  useEffect(() => {
    if (players) {
      players.forEach((player) => {
        player.type = 'player';
      });
      characterFactory.loadFromJSON(players);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  return (
    <div className='stage-players'>
      {characterFactory.getAllCharacters().map((player, index) => {
        const leftValue = player.x * cellSize.width;
        const topValue = player.y * cellSize.height;
        const playerSize = cellSize.width < cellSize.height ? cellSize.width * 0.8 : cellSize.height * 0.8; // Assuming player occupies 80% of the cell

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
