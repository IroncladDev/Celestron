// Type Imports
import { EnemyType, SegmentPath, ParticleType } from './Types';
import Vector from './Vector';
import World from './World';
import Particle from './Particle'
// Enemy Class
export default abstract class Enemy {
  // Public Properties
  public static Difficulty: number = 0;
  public static boss: boolean = false;
  public EnemyType: EnemyType;
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
        return;
      }
      if (this.currentPath.exitSegment) {
        this.currentPath = world.getPath(this.currentPath.exitSegment, this.Position, this.currentPath.segment);
        this.Update(deltaTime, world);
      } 
    }
    // Check if dead
    if (this.health <= 0) {
      for(let i = 10; i > 0; i--) {
        world.particles.set(
          world.particles.size,
          new Particle(world, ParticleType.Fire, this.Position.x, this.Position.y)
        ); 
      }
      this.dead = true;
      // Add Money
      //@ts-ignore
      world.money += Math.min(Math.abs(this.constructor.Difficulty*2), 100);
    }
  }
}
// Export Different Enemy Types
const TestEnemy = class extends Enemy {
  public static Difficulty: number = 1000;
  public health: number = 1;
  public maxHealth: number = 1;
  public scale: number = 1;
  public speed: number = 6;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.FireShieldGunner, position, path);
  }
}
const Basic = class extends Enemy {
  public static Difficulty: number = 1;
  public health: number = 2;
  public maxHealth: number = 2;
  public scale: number = 0.5;
  public speed: number = 6;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Basic, position, path);
  }
}
const Fast = class extends Enemy {
  public static Difficulty: number = 2;
  public health: number = 1;
  public maxHealth: number = 1;
  public scale: number = 0.4;
  public speed: number = 10;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Fast, position, path);
  }
}
const Strong = class extends Enemy {
  public static Difficulty: number = 4;
  public health: number = 5;
  public maxHealth: number = 5;
  public scale: number = 0.6;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Strong, position, path);
  }
}
const Ultra = class extends Enemy {
  public static Difficulty: number = 8;
  public maxHealth: number = 15;
  public health: number = 15;
  public scale: number = 0.7;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Ultra, position, path);
  }
}
const Scorpion1 = class extends Enemy {
  public static Difficulty: number = 16;
  public health: number = 20;
  public maxHealth: number = 20;
  public scale: number = 1;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Scorpion1, position, path);
  }
}
const Scorpion2 = class extends Enemy {
  public static Difficulty: number = 20;
  public health: number = 25;
  public maxHealth: number = 25
  public scale: number = 1.25;
  public speed: number = 3.25;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Scorpion2, position, path);
  }
}
const Wasp = class extends Enemy {
  public static Difficulty: number = 20;
  public health: number = 25;
  public maxHealth: number = 25
  public scale: number = 1;
  public speed: number = 5;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Wasp, position, path);
  }
}
const TitanBeetle = class extends Enemy {
  public static Difficulty: number = 40;
  public health: number = 50;
  public maxHealth: number = 50
  public scale: number = 1.5;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.TitanBeetle, position, path);
  }
}
const ShieldStrong = class extends Enemy {
  public static Difficulty: number = 32;
  public health: number = 65;
  public scale: number = 1.25;
  public maxHealth: number = 65
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.ShieldStrong, position, path);
  }
}
const ShieldDefault = class extends Enemy {
  public static Difficulty: number = 57;
  public health: number = 70;
  public maxHealth: number = 70
  public scale: number = 1;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.ShieldDefault, position, path);
  }
}
const FireShield = class extends Enemy {
  public static Difficulty: number = 76;
  public health: number = 80;
  public maxHealth: number = 80
  public scale: number = 1.25;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.FireShield, position, path);
  }
}
const FireShieldGunner = class extends Enemy {
  public static Difficulty: number = 83;
  public health: number = 90;
  public maxHealth: number = 90
  public scale: number = 1.5;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.FireShieldGunner, position, path);
  }
}
const Troll = class extends Enemy {
  public static Difficulty: number = 75;
  public health: number = 125;
  public maxHealth: number = 125
  public scale: number = 1.75;
  public speed: number = 2;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Troll, position, path);
  }
}
const GhostMantis = class extends Enemy {
  public static Difficulty: number = 80;
  public health: number = 125;
  public maxHealth: number = 125
  public scale: number = 1.75;
  public speed: number = 3;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.GhostMantis, position, path);
  }
}
const Virus1 = class extends Enemy {
  public static Difficulty: number = 60;
  public health: number = 30;
  public maxHealth: number = 30
  public scale: number = 1.25;
  public speed: number = 6;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Virus1, position, path);
  }
}
const Virus2 = class extends Enemy {
  public static Difficulty: number = 70;
  public health: number = 35;
  public maxHealth: number = 35
  public scale: number = 1.25;
  public speed: number = 8;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Virus2, position, path);
  }
}
const Ship = class extends Enemy {
  public static Difficulty: number = 160;
  public health: number = 100;
  public maxHealth: number = 100
  public scale: number = 2;
  public speed: number = 5;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Ship, position, path);
  }
}
const Boss1 = class extends Enemy {
  public static Difficulty: number = 300;
  public static boss = true;
  public health: number = 350;
  public maxHealth: number = 350
  public scale: number = 2.5;
  public speed: number = 4;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Boss1, position, path);
  }
}
const Boss2 = class extends Enemy {
  public static Difficulty: number = 400;
  public static boss = true;
  public health: number = 500;
  public maxHealth: number = 500
  public scale: number = 3;
  public speed: number = 5;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Boss2, position, path);
  }
}
const Spider = class extends Enemy {
  public static Difficulty: number = 72;
  public boss: boolean = true;
  public health: number = 150;
  public maxHealth: number = 150
  public scale: number = 1.5;
  public speed: number = 4;
  constructor(position: Vector, path: SegmentPath) {
    super(EnemyType.Spider, position, path);
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