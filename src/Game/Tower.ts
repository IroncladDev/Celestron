import { TargetType, TowerType } from './Types';
import Vector from './Vector';
import World from './World';
// Tower Class
export default class Tower {
  // Public Properties
  public TowerType: TowerType;
  public Position: Vector;
  public direction: Vector;
  public static moneyCost: number = 100;
  public damage: number = 1;
  public fireRate: number = 1;
  public speed: number = 1;
  public range: number = 5;
  public targetType: TargetType = TargetType.Closest;
  // Private Properties
  // Constructor
  constructor (towerType: TowerType, position: Vector, direction: Vector) {
    // Set Properties
    this.TowerType = towerType;
    this.Position = position;
    this.Direction = direction;
  }
  // Methods
  public Update(deltaTime: number, world: World) {
    // Look For Enemy's
    // Perform Rotation
    // Perform Shooting
  }
}