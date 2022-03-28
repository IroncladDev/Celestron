import {ParticleType} from './Types';
import Vector from './Vector';
import World from './World';
export default class Particle {
  public Position: Vector;
  public x: number = 0;
  public y: number = 0;
  public xVel: number = 0;
  public yVel: number = 0;
  public dead: boolean = false;
  public speed: number = 0;
  public ParticleType: ParticleType;
  public rot: number = 0;
  public Opacity: number = 10;
  public size: number = 0;
  // Private Propertis
  private World: World;

  constructor(world: World, particleType: ParticleType, x: number, y: number) {
    this.World = world;
    this.ParticleType = particleType;
    this.Position = new Vector(x, y);
    // Handle Particle Info
    switch(particleType){
      case ParticleType.Fire:
        this.rot = world.worldGenerator.nextRandomRange(180, 361);
        //this.speed = this.random(0.5, 5);
        this.size = world.worldGenerator.nextRandomRange(5, 31);
        this.Opacity = world.worldGenerator.nextRandomRange(50, 151)
        break;
      case ParticleType.Smoke:
        this.rot = world.worldGenerator.nextRandomRange(0, 361);
        //this.speed = this.random(0.5, 5);
        this.size = world.worldGenerator.nextRandomRange(3, 11);
        this.Opacity = world.worldGenerator.nextRandomRange(100, 201)
        break;
    }
  }
  public Update(deltaTime: number) {
    const rotationRadian = this.rot * (Math.PI/180);
    const speedScalar = deltaTime/500;
    switch(this.ParticleType){
      case ParticleType.Fire:
        this.Position
          .add(Math.cos(rotationRadian), Math.sin(rotationRadian) * 2)
          .mulScalar(this.size * speedScalar);
        this.size -= 0.15 * speedScalar;
        this.Opacity -= 2 * speedScalar;
      break;
      case ParticleType.Smoke:
        this.Position
          .add(Math.cos(rotationRadian), Math.sin(rotationRadian))
          .mulScalar(this.size * speedScalar);
        this.size -= 0.1 * speedScalar;
        this.Opacity -= 1 * speedScalar;
      break;
    }
    if(this.Opacity < 0 || this.size < 0){
      this.dead = true;
    }
  }
}