// Type Imports
import { EnemyType, SegmentPath } from './Types';
import Vector from './Vector';
import World from './World';
// Enemy Class
export default abstract class Enemy {
  // Public Properties
  public static Difficulty: number = 0;
  public EnemyType: EnemyType;
  public boss: boolean = false;
  public health: number = 1;
  public maxHealth: number = 1;
  public speed: number = 3;
  public scale: number = 0.5;
  public Position: Vector;
  public direction: Vector = new Vector(0, 0);
  public dead: boolean = false;
  public regen: number = 0;
  // Private Properties
  private currentPath: SegmentPath;
  // Constructor
  constructor(enemyType: EnemyType, position: Vector, path: SegmentPath) {
    this.EnemyType = enemyType;
    this.Position = position;
    this.currentPath = path;
    // Set Max Health
    this.maxHealth = this.health;
  }
  // Update
  public Update(deltaTime: number, world: World) {
    // Perform Movement
    if (this.currentPath.points.length > 0) {
      // Apply Speed
      const target = this.currentPath.points[0];
      const movement = this.Position.clone().subVector(target).normalize();
      this.Position.subVector(movement.mulScalar((deltaTime / 50) * this.speed));
      // Dont let us overshoot
      if (!movement.normalize().round().equals(this.Position.clone().subVector(target).normalize().round()))
        this.Position.copy(target);
      // Check if we reached target
      if (this.Position.distanceToSquared(this.currentPath.points[0]) < ((deltaTime / 50) * this.speed))
        this.currentPath.points.shift(); 
      this.direction = movement;
    } else {
      if (this.currentPath?.segment?.castlePosition != null) {
        this.dead = true;
        //@ts-ignore
        world.baseHealth -= Math.ceil(this.constructor.Difficulty/this.maxHealth*this.health);
        console.log('Castle Take Damage');
        return;
      }
      if (this.currentPath.exitSegment) {
        this.currentPath = world.getPath(this.currentPath.exitSegment, this.Position);
        this.Update(deltaTime, world);
      } else
        console.log('No New Path');
    }
    // Check if dead
    if (this.health == 0) this.dead = true;
  }
}
// Export Different Enemy Types
const TestEnemy = class extends Enemy {
  public static Difficulty: number = 1;
  public health: number = 1;
  public scale: number = 1;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.FireShieldGunner, position, path);
  }
}
const Basic = class extends Enemy {
  public static Difficulty: number = 1;
  public health: number = 2;
  public scale: number = 0.5;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Basic, position, path);
  }
}
const Fast = class extends Enemy {
  public static Difficulty: number = 1;
  public health: number = 1;
  public scale: number = 0.4;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Fast, position, path);
  }
}
const Strong = class extends Enemy {
  public static Difficulty: number = 1;
  public health: number = 5;
  public scale: number = 0.6;
  public speed: number = 1.5;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Strong, position, path);
  }
}
const Ultra = class extends Enemy {
  public static Difficulty: number = 2;
  public health: number = 15;
  public scale: number = 0.7;
  public speed: number = 1;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Ultra, position, path);
  }
}
const Scorpion1 = class extends Enemy {
  public static Difficulty: number = 3;
  public health: number = 20;
  public scale: number = 1;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Scorpion1, position, path);
  }
}
const Scorpion2 = class extends Enemy {
  public static Difficulty: number = 4;
  public health: number = 20;
  public scale: number = 1;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Scorpion2, position, path);
  }
}
const Wasp = class extends Enemy {
  public static Difficulty: number = 4;
  public health: number = 15;
  public scale: number = 1;
  public speed: number = 5;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Wasp, position, path);
  }
}
const TitanBeetle = class extends Enemy {
  public static Difficulty: number = 5;
  public health: number = 50;
  public scale: number = 1.5;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.TitanBeetle, position, path);
  }
}
const Spider = class extends Enemy {
  public static Difficulty: number = 5;
  public health: number = 40;
  public scale: number = 1.5;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Spider, position, path);
  }
}
const ShieldStrong = class extends Enemy {
  public static Difficulty: number = 7;
  public health: number = 75;
  public scale: number = 1.25;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.ShieldStrong, position, path);
  }
}
const ShieldDefault = class extends Enemy {
  public static Difficulty: number = 6;
  public health: number = 65;
  public scale: number = 1;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.ShieldDefault, position, path);
  }
}
const FireShield = class extends Enemy {
  public static Difficulty: number = 7;
  public health: number = 70;
  public scale: number = 1.25;
  public speed: number = 4;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.FireShield, position, path);
  }
}
const FireShieldGunner = class extends Enemy {
  public static Difficulty: number = 8;
  public health: number = 80;
  public scale: number = 1.5;
  public speed: number = 4;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.FireShieldGunner, position, path);
  }
}
const Troll = class extends Enemy {
  public static Difficulty: number = 9;
  public health: number = 125;
  public scale: number = 1.75;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Troll, position, path);
  }
}
const GhostMantis = class extends Enemy {
  public static Difficulty: number = 9;
  public health: number = 100;
  public scale: number = 1.75;
  public speed: number = 4;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.GhostMantis, position, path);
  }
}
const Virus1 = class extends Enemy {
  public static Difficulty: number = 10;
  public health: number = 50;
  public scale: number = 1.25;
  public speed: number = 7;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Virus1, position, path);
  }
}
const Virus2 = class extends Enemy {
  public static Difficulty: number = 10;
  public health: number = 75;
  public scale: number = 1.25;
  public speed: number = 7;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Virus2, position, path);
  }
}
const Ship = class extends Enemy {
  public static Difficulty: number = 10;
  public health: number = 200;
  public scale: number = 2;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Ship, position, path);
  }
}
const Boss1 = class extends Enemy {
  public static Difficulty: number = 20;
  public health: number = 250;
  public scale: number = 2.5;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Boss1, position, path);
  }
}
const Boss2 = class extends Enemy {
  public static Difficulty: number = 20;
  public health: number = 400;
  public scale: number = 3;
  public speed: number = 4;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Boss2, position, path);
  }
}
// Enemy Array
export const EnemyTypes: any[] = [
  TestEnemy,
  Basic,
  Fast,
  Strong,
  Ultra,
  Scorpion1,
  Scorpion2,
  Wasp,
  TitanBeetle,
  Spider,
  ShieldStrong,
  ShieldDefault,
  FireShield,
  FireShieldGunner,
  Troll,
  GhostMantis,
  Virus1,
  Virus2,
  Ship,
  Boss1,
  Boss2
];