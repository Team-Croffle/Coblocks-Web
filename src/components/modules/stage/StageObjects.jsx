import React, { useEffect, useState } from 'react';
import { StageObjectFactory } from './objects/StageObjectFactory';

/**
 * Component that renders all stage objects
 */
const StageObjects = ({ cellSize, objects }) => {
  const [objectFactory] = useState(() => new StageObjectFactory());

  useEffect(() => {
    if (objects) {
      objectFactory.loadFromJSON(objects);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objects]);

  return (
    <div className='stage-objects'>
      {objectFactory.getAllObjects().map((object) => {
        if (object.isCollected) return null;

        const image = object.getImage();
        const leftValue = object.x * cellSize.width;
        const topValue = object.y * cellSize.height;
        const fontSize = cellSize.width < cellSize.height ? cellSize.width * 0.7 : cellSize.height * 0.7;

        return (
          <div
            key={object.id}
            className={`stage-object ${object.type} ${object.state}`}
            style={{
              position: 'absolute',
              left: leftValue,
              top: topValue,
              width: cellSize.width,
              height: cellSize.height,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            {typeof image === 'string' ? (
              <div
                style={{
                  color: 'white',
                  fontSize: fontSize,
                  fontWeight: 'bold',
                }}
              >
                {image}
              </div>
            ) : (
              <img
                src={image}
                alt={object.type}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StageObjects;
