import React, { useEffect, useState } from 'react';
import { StageObjectFactory } from './objects/StageObjectFactory';

/**
 * Component that renders all stage objects
 */
const StageObjects = ({ cellSize, objects, onObjectUpdate }) => {
  const [objectFactory] = useState(() => new StageObjectFactory());

  useEffect(() => {
    if (objects) {
      objectFactory.loadFromJSON(objects);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objects]);

  const handleObjectInteraction = (objectId) => {
    const result = objectFactory.interactWithObject(objectId);
    if (result && onObjectUpdate) {
      onObjectUpdate(objectFactory.toJSON());
    }
  };

  return (
    <div className='stage-objects'>
      {objectFactory.getAllObjects().map((object) => {
        if (object.isCollected) return null;

        const image = object.getImage();
        const leftValue = object.x * cellSize.width;
        const topValue = object.y * cellSize.height;

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
            onClick={() => handleObjectInteraction(object.id)}
          >
            {typeof image === 'string' ? (
              <div
                style={{
                  color: 'white',
                  fontSize: cellSize.width / 2,
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
