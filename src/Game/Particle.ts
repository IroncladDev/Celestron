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
  public len: number = 0;
  // Private Propertis
  private World: World;

  constructor(
    world: World,
    particleType: ParticleType,
    x: number,
    y: number,
    {
      rotation
    }: {
      rotation?: number
    } = {}
  ) {
    this.World = world;
    this.ParticleType = particleType;
    this.Position = new Vector(x, y);
    if(rotation) this.rot = rotation;
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
        this.Opacity = world.worldGenerator.nextRandomRange(50,100)
        break;
      case ParticleType.Bullet:
        this.size = 600; //basically time
        this.len = 600;
        this.Opacity = 255;
        break;
      case ParticleType.MgunBullet:
        this.size = 300; //basically time
        this.len = 300;
        this.Opacity = 255;
        break;
      case ParticleType.RailgunBullet:
        this.size = 1000; //basically time
        this.len = 1000;
        this.Opacity = 255;
        break;
    }
  }
  public Update(deltaTime: number) {
    const rotationRadian = this.rot * (Math.PI/180);
    const speedScalar = deltaTime/500;
    switch(this.ParticleType){
      case ParticleType.Fire:
        this.Position.add(Math.cos(rotationRadian), Math.sin(rotationRadian) * 2);
        this.size -= 0.15;
        this.Opacity -= 1;
      break;
      case ParticleType.Smoke:
        this.Position.add(Math.cos(rotationRadian), Math.sin(rotationRadian) * 1.5);
        this.size += 2;
        this.Opacity -= 7;
      break;
      case ParticleType.Bullet:
        this.Position.add(Math.cos(rotationRadian), Math.sin(rotationRadian));
        this.size += (0-this.size)/10;
        this.Opacity -= 10;
        
      break;
      case ParticleType.MgunBullet:
        this.Position.add(Math.cos(rotationRadian), Math.sin(rotationRadian));
        this.size += (0-this.size)/5;
        this.Opacity -= 10;
          
      break;
      case ParticleType.RailgunBullet:
        this.Position.add(Math.cos(rotationRadian), Math.sin(rotationRadian));
        this.size += (0-this.size)/20;
        this.Opacity -= 10;
        
      break;
    }
    if(this.Opacity < 0 || this.size < 0){
      this.dead = true;
    }
  }
}