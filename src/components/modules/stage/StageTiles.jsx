import React, { useEffect, useState, useRef } from 'react';
import { StageTileFactory } from './tiles/StageTileFactory';

const StageTiles = ({ cellSize, tiles }) => {
  const [tileFactory] = useState(() => new StageTileFactory());
  const tileStageRef = useRef(null);

  useEffect(() => {
    if (tiles) {
      tileFactory.loadFromListValues(tiles);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  return (
    <div
      className='stage-tiles'
      ref={tileStageRef}
    >
      {tileFactory.getAllTiles().map((tile) => {
        const image = tile.getImage();
        const leftValue = tile.x * cellSize.width;
        const topValue = tile.y * cellSize.height;

        return (
          <div
            key={`${tile.type}-${tile.x}-${tile.y}`}
            className={`stage-tile ${tile.type}`}
            style={{
              position: 'absolute',
              left: leftValue,
              top: topValue,
              width: cellSize.width,
              height: cellSize.height,
              zIndex: 1,
              border: '1px solid lightgray',
            }}
          >
            {typeof image === 'string' ? (
              <img
                src={image}
                alt={tile.type}
              />
            ) : (
              <div style={image.style} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StageTiles;
