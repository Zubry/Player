import { Record as record } from 'immutable';
import check from 'check-types';

import ColorPalette from '@zubry/colorpalette';
import { BoundingCircle as Circle } from '@zubry/boundary';
import Position from '@zubry/position';

const PlayerRecord = record({
  boundary: new Circle({ center: new Position({ x: 0, y: 0 }), radius: 10 }),
  rotation: 0,
  maxHealth: 100,
  currentHealth: 100,
  weapon: null,
  color: new ColorPalette(),
  rotationSpeed: 10,
  movementSpeed: 10,
});

function mod(a, n) {
  return ((a % n) + n) % n;
}

export default class Player extends PlayerRecord {
  rotateRight() {
    return this
      .update('rotation', (rotation) => mod(rotation + this.rotationSpeed, 360));
  }

  rotateLeft() {
    return this
      .update('rotation', (rotation) => mod(rotation - this.rotationSpeed, 360));
  }

  move() {
    const movementVector = (new Position(this.rotation)).scale(this.movementSpeed);
    return this
      .update('boundary', (boundary) => boundary.shift(movementVector));
  }

  damage(amount) {
    return this
      .update('currentHealth', (h) => h - amount);
  }

  isAlive() {
    return this.currentHealth > 0;
  }

  isDead() {
    return !this.isAlive();
  }

  fire() {
    if (check.null(this.weapon)) {
      return null;
    }

    return this.weapon.spawn({ boundary: this.boundary, direction: this.rotation });
  }

  equip(weapon) {
    return this
      .set('weapon', weapon);
  }

  unequip() {
    return this
      .set('weapon', null);
  }

  intersects(boundary) {
    return this.boundary.intersects(boundary);
  }
}
