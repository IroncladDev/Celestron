import { TargetType, TowerType, ParticleType } from './Types';
import Vector from './Vector';
import Enemy from './Enemy';
import World from './World';
import Particle from './Particle';
// Tower Class
export default class Tower {
  // Public Properties
  public TowerType: TowerType;
  public Position: Vector;
  public Direction: number;
  public damage: number = 0.5;
  public currentFireCycle: number = 0;
  public fireRate: number = 500;
  public speed: number = 20;
  public range: number = 200;
  public targetType: TargetType = TargetType.Random;
  public level: number = 0;
  private target: number | null = null;
  public kills: number = 0;
  public dead: boolean = false;
  public cost: number = 0;
  // Constructor
  constructor (
    cost: number,
    towerType: TowerType,
    position: Vector,
    direction: number,
    level: number = 0
  ) {
    // Set Properties
    this.cost = cost;
    this.TowerType = towerType;
    this.Position = position;
    this.Direction = direction;
    this.level = level;
    // Set Damage
    switch (towerType) {
      case TowerType.Basic:
        this.damage = 0.5 * ((this.level+1) * 1.1);
        this.fireRate = 1000;
        this.speed = 15 * 1.05 * (this.level+1);
        this.range = 200 * (this.level+1);
        break;
      case TowerType.Machine:
        this.damage = 0.25 * ((this.level+1) * 1.1);
        this.fireRate = 300 - ((this.level+1) - 20);
        this.speed = 25 - ((this.level+1) * 2.5);
        this.range = 150 + ((this.level+1) * 50);
        break;
      case TowerType.RailGun:
        this.damage = 2.5 * ((this.level+1));
        this.fireRate = 2000 - ((this.level+1) * 50);
        this.speed = 20 * 1.05 * (this.level+1);
        this.range = 250 * (this.level + 1);
        break;
    }
  }
  // Methods
  public Update(deltaTime: number, world: World) {
    const enemiesInRange = new Map([...world.enemys.entries()].filter(([ key, enemy ]) => {
      return this.Position.distanceTo(enemy.Position) < this.range;
    }));
    if (enemiesInRange.size <= 0) return;
    // Choose Enemy
    let target = this.target;
    // If we already have a target
    if (this.target == null || !enemiesInRange.has(this.target)) {
      // if we need to choose a new enemy
      if (this.targetType == TargetType.Random) {
        // Cache enemy
        target = world.worldGenerator.nextRandomChoice([...world.enemys.keys()]);
      } else if (this.targetType == TargetType.Closest) {
        
      } else if (this.targetType == TargetType.Farthest) {
        
      }
    }
    if (target == null) return;
    const targetEnemy = <Enemy>world.enemys.get(target);
    // Set Direction Toward Enemy
    const targetAngle = targetEnemy.Position
      .clone()
      .subVector(this.Position)
      .normalize()
    ;
    const direction = Math.atan2(targetAngle.y, targetAngle.x);
    this.Direction += (direction - this.Direction) / (this.speed * (world.worldSpeedScalar * 2))*2;
    // Check If we are facing towards enemy
    if (this.TowerType == TowerType.Machine && this.currentFireCycle < 0) {
      for(var i = 10;i--;) {
        world.particles.set(
        world.particles.size,
        new Particle(world, ParticleType.Smoke, this.Position.x + Math.cos(this.Direction) * 50, this.Position.y + Math.sin(this.Direction) * 50, {rotation: this.Direction})
      );
      }
      if(this.Direction-direction > -Math.PI/8 && this.Direction-direction < Math.PI/8){
        targetEnemy.health -= this.damage;
        if (targetEnemy.health <= 0) this.kills++;
      }
      this.currentFireCycle = this.fireRate;
      world.audioEngine.effect('mgun.mp3', 0.25); 
      world.particles.set(
        world.particles.size,
        new Particle(world, ParticleType.MgunBullet, this.Position.x, this.Position.y, {rotation: this.Direction})
      );
    } else if (this.Direction-direction > -Math.PI/16 && this.Direction-direction < Math.PI/16 && this.currentFireCycle < 0) {
      targetEnemy.health -= this.damage;
      if (targetEnemy.health <= 0) this.kills++;
      this.currentFireCycle = this.fireRate;
      if (this.TowerType == TowerType.Basic) {
        world.audioEngine.effect('laser.mp3', 0.4); 
        world.particles.set(
          world.particles.size,
          new Particle(world, ParticleType.Bullet, this.Position.x, this.Position.y, {rotation: this.Direction})
        );
      } else {
        world.audioEngine.effect('sniper.mp3', 0.6); 
        world.particles.set(
          world.particles.size,
          new Particle(world, ParticleType.RailgunBullet, this.Position.x, this.Position.y, {rotation: this.Direction})
        );
      }
    } else {
      this.currentFireCycle -= deltaTime;
    }
    // Handle Upgrade
    if ((this.kills+1) % 30 == 0 && this.level < 3) {
      this.damage /= 1.1 * this.level;
      this.speed /= 1.05 * this.level;
      this.level++;
      this.damage *= 1.1 * this.level;
      this.speed *= 1.05 * this.level;
    }
    // Cache
    this.target = target;
  }
}