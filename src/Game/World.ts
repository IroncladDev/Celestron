// Import Types
import { SegmentPath, WorldSegment, WorldContents, WorldSegmentContents, Side, ParticleType } from './Types';
// Import Modules
import Random from './Random';
import Vector from './Vector';
import { generateWorldSegment, segmentTypeList } from './WorldSegment';
import Enemy, { EnemyTypes } from './Enemy';
import Tower from './Tower';
import Particle from './Particle';

// TODO: Give Segments Entrance And Exits so that we always have a path back home
// World Class
export default class World {
  public paused: boolean = false;
  public money: number = 10;
  public waveCount: number = 0;
  public activeWave: boolean = false;
  public WorldSegmentList: WorldSegmentContents[] = [];
  public worldGenerator: Random;
  public baseHealth: number = 10;
  // Properties
  private seed: number;
  private enemys: Map<number, Enemy> = new Map();
  private particles: Map<number, Particle> = new Map();
  private towers: Map<number, Tower> = new Map();
  private waveEnded: boolean = true;
  // Constructor
  constructor () {
    // Initalize Random Generator
    // this.seed = Math.random();
    this.seed = 0.01608666435702122;
    this.worldGenerator = new Random(this.seed);
    // Spawn Initial Segment
    this.addSegment();
    for (let i = 0; i < 4; i++) {
      try {
        console.log(`Spawning Tile ${i}`);
        this.addSegment();
      } catch (err) {
        console.log(err);
      }
    }
    this.particles.set(
      this.particles.size,
      new Particle(this, ParticleType.Fire, 100, 100)
    );
  }
  // Methods
  public addSegment(
    trys: number = 0,
    choosableSegmentTypes: WorldSegment[] = segmentTypeList
  ): void {
    // Choose Random Segment
    const worldSegmentType = (this.WorldSegmentList.length == 0) ? 0 : this.worldGenerator.nextRandomRange(
      0,
      choosableSegmentTypes.length
    );
    const choosenSegment = choosableSegmentTypes[worldSegmentType];
    // Determine X and Y
    const choosableWorldSegments = this.WorldSegmentList.filter(({ freeSide }) => {
      return (
        (freeSide.has(Side.Top) && choosenSegment.freeSide.has(Side.Bottom)) ||
        (freeSide.has(Side.Bottom) && choosenSegment.freeSide.has(Side.Top)) ||
        (freeSide.has(Side.Left) && choosenSegment.freeSide.has(Side.Right)) ||
        (freeSide.has(Side.Right) && choosenSegment.freeSide.has(Side.Left))
      );
    });
    if (choosableWorldSegments.length == 0 && this.WorldSegmentList.length != 0) {
      // We need to narrow down our choices
      const openWorldSegments = this.WorldSegmentList.filter(({ freeSide }) => freeSide.size > 0);
      choosableSegmentTypes = choosableSegmentTypes.filter((testSegment) => {
        return openWorldSegments.some(({ freeSide }) => {
          return (
            (freeSide.has(Side.Top) && testSegment.freeSide.has(Side.Bottom)) ||
            (freeSide.has(Side.Bottom) && testSegment.freeSide.has(Side.Top)) ||
            (freeSide.has(Side.Left) && testSegment.freeSide.has(Side.Right)) ||
            (freeSide.has(Side.Right) && testSegment.freeSide.has(Side.Left))
          );
        });
      });
      // try Again
      return this.addSegment(trys + 1, choosableSegmentTypes);
    }
    // TODO: Make sure we can never get to a spot where we dont have any worldSegments that would work
    const choosenAttachement = choosableWorldSegments[this.worldGenerator.nextRandomRange(0, choosableWorldSegments.length)];
    // Determine Side
    let x = (choosenAttachement?.x ?? 0), y = (choosenAttachement?.y ?? 0);
    let side: Side | null = Side.Bottom;
    if (choosenAttachement) {
      // Make Array Of Free Side
      const freeSides = [
        (choosenAttachement.freeSide.has(Side.Top) && choosenSegment.freeSide.has(Side.Bottom)) ? Side.Top : null,
        (choosenAttachement.freeSide.has(Side.Bottom) && choosenSegment.freeSide.has(Side.Top)) ? Side.Bottom : null,
        (choosenAttachement.freeSide.has(Side.Left) && choosenSegment.freeSide.has(Side.Right)) ? Side.Left : null,
        (choosenAttachement.freeSide.has(Side.Right) && choosenSegment.freeSide.has(Side.Left)) ? Side.Right : null,
      ].filter(n => n != null);
      // Only Pick A Free Side
      const choosenSide = this.worldGenerator.nextRandomChoice(freeSides);
      if (choosenSide == undefined)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      switch (choosenSide) {
        case Side.Top:
          side = Side.Top;
          y -= choosenSegment.height;
          break;
        case Side.Bottom:
          side = Side.Bottom;
          y += choosenSegment.height;
          break;
        case Side.Right:
          side = Side.Right;
          x += choosenSegment.width; 
          break;
        case Side.Left:
          side = Side.Left;
          x -= choosenSegment.width;
          break;
      }
    }
    // Generate Segment
    const worldSegment = generateWorldSegment(x, y, side, choosenSegment, this.WorldSegmentList);
    if (worldSegment == false)
      return this.addSegment(trys + 1, choosableSegmentTypes); 
    // Verify Segment
    if (choosenSegment.freeSide.has(Side.Top)) {
      const segmentAtPos = this.WorldSegmentList.find((segment) =>
        segment.x == x && segment.y == y-choosenSegment.height
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) {
        worldSegment.paths.forEach((path) => {
          if (path.pathSides.has(Side.Top))
            path.exitSegment = segmentAtPos;
        });
        worldSegment.freeSide.delete(Side.Top);
      }
    }
    if (choosenSegment.freeSide.has(Side.Bottom)) {
      const segmentAtPos = this.WorldSegmentList.find((segment) =>
        segment.x == x && segment.y == y+choosenSegment.height
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) {
        worldSegment.paths.forEach((path) => {
          if (path.pathSides.has(Side.Bottom))
            path.exitSegment = segmentAtPos;
        });
        worldSegment.freeSide.delete(Side.Bottom);
      }
    }
    if (choosenSegment.freeSide.has(Side.Left)) {
      const segmentAtPos = this.WorldSegmentList.find((segment) =>
        segment.x == x-choosenSegment.width && segment.y == y
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) {
        worldSegment.paths.forEach((path) => {
          if (path.pathSides.has(Side.Left))
            path.exitSegment = segmentAtPos;
        });
        worldSegment.freeSide.delete(Side.Left);
      }
    }
    if (choosenSegment.freeSide.has(Side.Right)) {
      const segmentAtPos = this.WorldSegmentList.find((segment) =>
        segment.x == x+choosenSegment.width && segment.y == y
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) {
        worldSegment.paths.forEach((path) => {
          if (path.pathSides.has(Side.Right))
            path.exitSegment = segmentAtPos;
        });
        worldSegment.freeSide.delete(Side.Right);
      }
    }
    if (
      worldSegment.freeSide.size == 0
      // TODO: remove from the list of possible segments
    ) return this.addSegment(trys + 1, choosableSegmentTypes);
    // Toggle Attachment
    if (choosenAttachement && side == Side.Top){
      choosenAttachement.paths.forEach((path) => {
        if (path.pathSides.has(Side.Top))
          path.entranceSegment = worldSegment;
      });
      choosenAttachement.freeSide.delete(Side.Top);
    } else if (choosenAttachement && side == Side.Bottom) {
      choosenAttachement.paths.forEach((path) => {
        if (path.pathSides.has(Side.Bottom))
          path.entranceSegment = worldSegment;
      });
      choosenAttachement.freeSide.delete(Side.Bottom);
    } else if (choosenAttachement && side == Side.Left) {
      choosenAttachement.paths.forEach((path) => {
        if (path.pathSides.has(Side.Left))
          path.entranceSegment = worldSegment;
      });
      choosenAttachement.freeSide.delete(Side.Left);
    } else if (choosenAttachement && side == Side.Right) {
      choosenAttachement.paths.forEach((path) => {
        if (path.pathSides.has(Side.Right))
          path.entranceSegment = worldSegment;
      });
      choosenAttachement.freeSide.delete(Side.Right);
    }
    // Push Segment To Array
    console.log(worldSegment);
    this.WorldSegmentList.push(worldSegment);
  }
  public getPath(segment: WorldSegmentContents, lastPoint: Vector): SegmentPath {
    // Find Closest Point
    let closestDistance = Number.MAX_SAFE_INTEGER;
    let closestPath: SegmentPath | null = null;
    for (const path of segment.paths) {
      const { points } = path;
      // Check First Point
      const startDistance = points[0].distanceToSquared(lastPoint);
      if (startDistance < closestDistance) {
        closestDistance = startDistance;
        closestPath = {
          points: points,
          entranceSegment: path.entranceSegment,
          exitSegment: path.exitSegment,
          pathSides: path.pathSides,
          segment: segment
        };
      }
      // Check Last Point
      const endDistance = points[points.length-1].distanceToSquared(lastPoint);
      if (endDistance < closestDistance) {
        closestDistance = endDistance;
        closestPath = {
          points: points.reverse(),
          entranceSegment: path.entranceSegment,
          exitSegment: path.exitSegment,
          pathSides: path.pathSides,
          segment: segment
        };
      }
    }
    if (closestPath == null)
      closestPath = segment.paths[0];
    return {
      points: closestPath.points.map((vec) => vec.clone().add(segment.x, segment.y)),
      entranceSegment: closestPath.entranceSegment,
      exitSegment: closestPath.exitSegment,
      pathSides: closestPath.pathSides,
      segment: segment
    }
  }
  public newWave(): void {
    if (this.activeWave) return;
    this.waveCount++;
    this.activeWave = true;
    // Determine How Many Enemys There Should Be
    let difficultyLevel = this.waveCount*this.waveCount;
    // Spawn Enemy's
    if (this.waveCount % 10 == 0) {
      // Spawn In A Boss
      // TODO: Bosses always spawn as far away as possible from the castle
    }
    // Spawn In Normal Enemies
    while (true) {
      // Remove Any Enemies That Dont Work
    const validEnemies = EnemyTypes.filter(e => e.Difficulty == 1 || e.Difficulty*2 < difficultyLevel);
    // Choose A Random Enemy
    const enemyChoice = this.worldGenerator.nextRandomChoice(validEnemies);
    // Find A Start Point
      // TODO: Bias Towards Farther Segments
      const openSegments = this.WorldSegmentList.filter((segment) => {
        return segment.freeSide.size > 0;
      });
      const segmentChoice = this.worldGenerator.nextRandomChoice(openSegments);
      // Only Pick A Free Side
      const choosenSide = this.worldGenerator.nextRandomChoice([...segmentChoice.freeSide.values()]);
      let targetPoint = new Vector(segmentChoice.width/2, 0);
      switch (choosenSide) {
        case Side.Top:
          targetPoint = new Vector(segmentChoice.width/2, 0);
          break;
        case Side.Bottom:
          targetPoint = new Vector(segmentChoice.width/2, segmentChoice.height);
          break;
        case Side.Right:
          targetPoint = new Vector(segmentChoice.width, segmentChoice.height/2);
          break;
        case Side.Left:
          targetPoint = new Vector(0, segmentChoice.height/2);
          break;
      }
      // TODO: Consider using manhatten distance for this for better speed
      const pathInformation = this.getPath(segmentChoice, targetPoint);
      // Subtract Difficulty Points
      difficultyLevel -= enemyChoice.Difficulty;
      // Add Enemy
      this.enemys.set(
        this.enemys.size,
        new enemyChoice(pathInformation.points[0], pathInformation)
      );
      // Once we run out of points break
      if (difficultyLevel <= 0) break;
    }
  }
  public Update(deltaTime: number): void {
    // Update Enemies
    for (const [ key, enemy ] of this.enemys.entries()) {
      enemy.Update(deltaTime, this);
      if (enemy.dead) {
        this.enemys.delete(key);
      }
    }
    // TODO: Update Towers
    // Update Particles
    for (const [ key, particle ] of this.particles.entries()) {
      particle.Update(deltaTime);
      if (particle.dead) {
        this.particles.delete(key);
      }
    }
    // Detect If The Wave is Over
    if (this.activeWave && this.enemys.size <= 0) {
      // Wave is over
      this.activeWave = false;
      this.money += 100; // Give you a 100 dolar level completion bonus
      // Add A Segment
      this.waveEnded = true;
      this.addSegment();
    }
  }
  public unend() {
    this.waveEnded = false;
  }
  // Render & Export Function
  public getContents (): WorldContents {
    return {
      seed: this.seed,
      wave: this.waveCount,
      WorldSegmentList: this.WorldSegmentList,
      enemys: this.enemys,
      particles: this.particles,
      towers: this.towers,
      waveEnded: this.waveEnded
    };
  }
}