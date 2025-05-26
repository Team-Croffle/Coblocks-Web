# Character Sprites

This directory contains sprite images for character animations used in the game.

## Directory Structure

- `Idle/`: Contains sprite images for idle animations (15 frames)
- `Walk/`: Contains sprite images for walking animations (15 frames)

## How to Use

The sprite images are loaded in the `StageScene.js` file and used by the `Character.js` class to animate characters in the game.

### Adding New Sprites

1. Place your sprite images in the appropriate directory (Idle or Walk)
2. Follow the naming convention: `Idle (N).png` or `Walk (N).png` where N is the frame number
3. Ensure all images have consistent dimensions and the character is centered

### Supported Animations

Currently, the game supports two animations:
- Idle: Played when the character is not moving
- Walk: Played when the character is moving

## Technical Details

- The game expects 15 frames for each animation
- Images should be in PNG format with transparency
- The Character class automatically handles flipping sprites for left/right directions