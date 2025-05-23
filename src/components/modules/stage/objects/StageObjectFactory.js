import { Key } from './implementations/Key';
import { Box } from './implementations/Box';
import { Button } from './implementations/Button';
import { Door } from './implementations/Door';

/**
 * Manages all objects in the stage
 */
export class StageObjectFactory {
  constructor() {
    this.objects = new Map();
    this.objectFactories = new Map([
      ['key', (id, x, y) => new Key(id, x, y)],
      ['box', (id, x, y) => new Box(id, x, y)],
      ['button', (id, x, y) => new Button(id, x, y)],
      ['door', (id, x, y) => new Door(id, x, y)],
    ]);
  }

  // Create and add a new object
  createObject(id, type, x, y) {
    const factory = this.objectFactories.get(type);
    if (!factory) {
      throw new Error(`Unknown object type: ${type}`);
    }

    const object = factory(id, x, y);
    this.objects.set(id, object);
    return object;
  }

  // Get object by ID
  getObject(id) {
    return this.objects.get(id);
  }

  // Get all objects
  getAllObjects() {
    return Array.from(this.objects.values());
  }

  // Get objects at specific coordinates
  getObjectsAt(x, y) {
    return this.getAllObjects().filter((obj) => obj.x === x && obj.y === y);
  }

  // Remove object by ID
  removeObject(id) {
    return this.objects.delete(id);
  }

  // Link two objects (e.g., button to door)
  linkObjects(sourceId, targetId) {
    const source = this.getObject(sourceId);
    const target = this.getObject(targetId);

    if (!source || !target) {
      return false;
    }

    if (typeof source.setLinkedObject === 'function') {
      source.setLinkedObject(targetId);
      return true;
    }
    return false;
  }

  // Handle object interaction
  interactWithObject(id) {
    const object = this.getObject(id);
    if (!object || typeof object.interact !== 'function') {
      return false;
    }

    const result = object.interact();
    if (result && object.getLinkedObject) {
      const linkedId = object.getLinkedObject();
      if (linkedId) {
        const linkedObject = this.getObject(linkedId);
        if (linkedObject && typeof linkedObject.interact === 'function') {
          linkedObject.interact();
        }
      }
    }
    return result;
  }

  // Load objects from JSON data
  /**
   *
   * @param {object} objectsData {id: string, type: string, x: number, y: number, state: string, linkedTo: string}
   */
  loadFromJSON(objectsData) {
    this.objects.clear();
    objectsData.forEach((data) => {
      const object = this.createObject(data.id, data.type, data.x, data.y);
      if (object.state) {
        object.setState(data.state);
      }
      if (data.linkedTo) {
        object.setLinkedObject(data.linkedTo);
      }
    });
  }

  // Export objects to JSON
  toJSON() {
    return this.getAllObjects().map((obj) => obj.toJSON());
  }
}
