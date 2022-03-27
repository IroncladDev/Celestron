// Type Imports
import { EnemyType } from './Types';
import Vector from './Vector';
import World from './World';
// Enemy Class
export default class Enemy {
  // Public Properties
  public static Difficulty: number = 0;
  public EnemyType: EnemyType;
  public Position: Vector;
  // Private Properties
  private currentPath: Vector[] = [];
  // Constructor
  constructor(enemyType: EnemyType, position: Vector, path: Vector[]) {
    this.EnemyType = enemyType;
    this.Position = position;
    this.currentPath = path;
  }
  // Update
  public Update(deltaTime: number, world: World) {
    // Perform Movement
    // TODO: Smooth This Lerp to deltaTime
    if (this.currentPath.length > 0) {
      this.Position.lerp(this.currentPath[0], 0.0025);
      if (this.Position.equals(this.currentPath[0]))
        this.currentPath.shift(); 
    } else {
      // TODO: Get Next Path Segment
    }
  }
}
// Export Different Enemy Types
const TestEnemy = class extends Enemy {
  public static Difficulty: number = 1;
  constructor(position: Vector, path: Vector[]) {
    super(EnemyType.Test, position, path);
  }
  // Render
}
// Enemy Array
export const EnemyTypes: Enemy[] = [
  TestEnemy
];