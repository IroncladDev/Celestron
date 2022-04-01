// Import Types
import { SegmentPath, WorldContents, WorldSegmentContents, Side } from './Types';
// Import Modules
import Random from './Random';
import Vector from './Vector';
import { generateWorldSegment, segmentTypeList } from './WorldSegment';
import Enemy, { EnemyTypes } from './Enemy';
import Tower from './Tower';
import Particle from './Particle';
import AudioEngine from './AudioEngine';


const getOppositeSide = (side: Side): Side => {
  switch (side) {
    case Side.Top: return Side.Bottom;
    case Side.Bottom: return Side.Top;
    case Side.Left: return Side.Right;
    case Side.Right: return Side.Left;
  }
}
// TODO: Give Segments Entrance And Exits so that we always have a path back home
// World Class
export default class World {
  public paused: boolean = false;
  public money: number = 200;
  public waveCount: number = 0;
  public activeWave: boolean = false;
  public waveEnded: boolean = true;
  public WorldSegmentList: WorldSegmentContents[] = [];
  public worldGenerator: Random;
  public baseHealth: number = 10;
  public towerMouse: Tower | null = null;
  public activeModal: boolean = false;
  // Properties
  private seed: number;
  private segmentRandomizer: Random;
  public enemys: Map<number, Enemy> = new Map();
  public bufferEnemys: Enemy[] = [];
  public particles: Map<number, Particle> = new Map();
  public towers: Map<number, Tower> = new Map();
  public audioEngine: AudioEngine;
  public worldSpeedScalar = 1;
  public gameOver: boolean = false;
  // Constructor
  constructor (audioEngine: AudioEngine) {
    // Initalize Random Generator
    this.audioEngine = audioEngine;
    this.seed = Math.random();
    // this.seed = 0.01608666435702122;
    this.worldGenerator = new Random(this.seed);
    this.segmentRandomizer = new Random(this.seed);
    // Spawn Initial Segment
    for (let i = 0; i < 6; i++) {
      try {
        this.addSegment();
      } catch (err) {
      }
    }
    // Add Particles as test
  }
  // Methods
  public getSideCordinates(side: Side, segment: WorldSegmentContents, size?: number): Vector {
    // Find Position
    let searchX = segment.x;
    let searchY = segment.y;
    if (side == Side.Top) searchY -= size ?? segment.width;
    else if (side == Side.Bottom) searchY += size ?? segment.width;
    else if (side == Side.Left) searchX -= size ?? segment.height;
    else if (side == Side.Right) searchX += size ?? segment.height;
    return new Vector(searchX, searchY);
  }
  public getSegmentSide(side: Side, segment: WorldSegmentContents): WorldSegmentContents | undefined {
    const position = this.getSideCordinates(side, segment);
    // Search For Enemy
    return this.getSegment(position.x, position.y);
  }
  public getSegment(x: number, y: number): WorldSegmentContents | undefined {
    return this.WorldSegmentList.find((segment) => (segment.x == x && segment.y == y));
  }
  public addSegment(): void {
    // Handle First Segment
    if (this.WorldSegmentList.length == 0) {
      // Generate Segment
      const spawnSegment = this.segmentRandomizer.nextRandomChoice(segmentTypeList.filter((segment) => {
        return segment.castlePosition != undefined;
      }));
      // Init segment
      const segment = <WorldSegmentContents>generateWorldSegment(0, 0, Side.Bottom, spawnSegment, this.WorldSegmentList);
      // Spawn Segment
      this.WorldSegmentList.push(segment);
      return;
    }
    // Perform Initial Filter Of Viable World Segments
    const viableConnections = this.WorldSegmentList.filter((connection) => {
      if (connection.freeSide.size != 0 && connection.paths.some((path) => !path.entranceSegment)) {
        for (const path of connection.paths) {
          for (const side of path.pathSides) {
            if (this.getSegmentSide(side, connection) == undefined)
              return true;
          }
        } 
      }
      return false;
    });
    // Choose world segment
    const connection = this.segmentRandomizer.nextRandomChoice(viableConnections);
    // Find FreeSides
    const openSides: ({ path: SegmentPath, side: Side })[] = [];
    for (const path of connection.paths) {
      if (path.exitSegment || connection.castlePosition != undefined) {
        for (const side of path.pathSides) {
          if (this.getSegmentSide(side, connection) == undefined) {
            openSides.push({ path: path, side: side });
          } else path.pathSides.delete(side);
        }
      }
    }
    // Choose Side
    const connectionSide = this.segmentRandomizer.nextRandomChoice(openSides);
    // Get Tile Position
    const tilePosition = this.getSideCordinates(connectionSide.side, connection);
    // Choose Tile Type
    const viableChoices = segmentTypeList.filter((segment) => {
      return segment.castlePosition == undefined && segment.paths.some((path) => {
        if (path.pathSides.has(getOppositeSide(connectionSide.side))) {
          const predictedSegment = <WorldSegmentContents>{
            x: tilePosition.x,
            y: tilePosition.y,
            width: connection.width,
            height: connection.height
          }
          return [...path.pathSides].every((side) => {
            return (
              side == getOppositeSide(connectionSide.side) ||
              this.getSegmentSide(
                side,
                predictedSegment
              ) == undefined
            );
          });
        }
        return false;
      });
    });
    // Filter Tile Type
    const choice = this.segmentRandomizer.nextRandomChoice(viableChoices);
    // Create Tile
    const generatedChoice = generateWorldSegment(
      tilePosition.x,
      tilePosition.y,
      connectionSide.side,
      choice,
      this.WorldSegmentList
    );
    if (!generatedChoice) return this.addSegment();
    // Set Tile Path Info
    connectionSide.path.entranceSegment = generatedChoice;
    connectionSide.path.pathSides.delete(connectionSide.side);
    for (const path of generatedChoice.paths) {
      if (path.pathSides.has(getOppositeSide(connectionSide.side))) {
        path.pathSides.delete(getOppositeSide(connectionSide.side));
        path.exitSegment = connection;
      }
    }
    // Add World Tile
    this.WorldSegmentList.push(generatedChoice);
  }
  public getPath(segment: WorldSegmentContents, lastPoint: Vector, lastSegment?: WorldSegmentContents): SegmentPath {
    // Find Closest Point
    let closestDistance = Number.MAX_SAFE_INTEGER;
    let closestPath: SegmentPath | null = null;
    for (const path of segment.paths) {
      const { points } = path;
      // Check First Point
      const startDistance = lastPoint.distanceToSquared(points[0].clone().add(segment.x, segment.y));
      let exitSegment = path.exitSegment, entranceSegment = path.entranceSegment;
        if (path.entranceSegment && lastSegment) {
          exitSegment = (lastSegment.x == path.entranceSegment.x && lastSegment.y == path.entranceSegment.y) ? path.exitSegment : path.entranceSegment;
        }
        if (path.exitSegment && lastSegment) {
          entranceSegment = (lastSegment.x == path.exitSegment.x && lastSegment.y == path.exitSegment.y) ?  path.entranceSegment : path.exitSegment;
        }
      if (startDistance < closestDistance) {
        closestDistance = startDistance;
        closestPath = {
          points: points,
          entranceSegment: entranceSegment,
          exitSegment: exitSegment,
          pathSides: path.pathSides,
          segment: segment
        };
      }
      // Check Last Point
      const endDistance = lastPoint.distanceToSquared(points[points.length-1].clone().add(segment.x, segment.y));
      if (endDistance < closestDistance) {
        closestDistance = endDistance;
        closestPath = {
          points: [...points].reverse(),
          entranceSegment: entranceSegment,
          exitSegment: exitSegment,
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
    if (this.waveCount % 10 == 0 && this.baseHealth < 10) {
      this.baseHealth++;
    }
    this.activeWave = true;
    // Determine How Many Enemys There Should Be
    let difficultyLevel = this.waveCount*this.waveCount;
    // Spawn Enemy's
    if (this.waveCount % 10 == 0 )
      difficultyLevel += this.waveCount / 10 * 250;
    // Spawn In Normal Enemies
    let i = 0;
    while (difficultyLevel > 0) {
      // Filter to Difficulty
      let validEnemies = EnemyTypes.filter((e) => {
        return (e.Difficulty == 1 || e.Difficulty*2 < difficultyLevel) && (this.waveCount % 10 === 0 ? !e.boss : e);
      });
      // Choose A Random Enemy
      let enemyChoice = this.worldGenerator.nextRandomChoice(validEnemies);
      if (this.waveCount % 10 == 0 && i < this.waveCount / 10) {
        const enemyScale = validEnemies.sort((a, b) => a.Difficulty - b.Difficulty);
        enemyChoice = enemyScale.find(e => e.Difficulty <= difficultyLevel);
      }
      // Find A Start Point
      const openSegments = this.WorldSegmentList.filter((segment) => {
        return segment.paths.some(path => path.entranceSegment == undefined);
      });
      const segmentChoice = this.worldGenerator.nextRandomChoice(openSegments);
      // Pick Spawn Side
      const paths = segmentChoice.paths.filter((path) => !path.entranceSegment);
      const choosenPath = this.worldGenerator.nextRandomChoice(paths);
      // Only Pick A Free Side
      const viableSides = [...choosenPath.pathSides].filter((side) => {
        return this.getSegmentSide(side, segmentChoice) == undefined;
      });
      const entranceSide = this.worldGenerator.nextRandomChoice(viableSides);
      const targetPoint = this.getSideCordinates(entranceSide, segmentChoice);
      // TODO: Consider using manhatten distance for this for better speed
      const pathInformation = this.getPath(segmentChoice, targetPoint);
      // Subtract Difficulty Points
      difficultyLevel -= enemyChoice.Difficulty;
      // Add Enemy
      this.bufferEnemys.push(
        new enemyChoice(pathInformation.points[0], pathInformation)
      );
      i++;
    }
    // Add One enemy
    this.enemys.set(this.enemys.size, <Enemy>this.bufferEnemys.shift());
  }
  public Update(deltaTime: number, frameCount: number): void {
    deltaTime = deltaTime/this.worldSpeedScalar;
    // Add buffer enemys
    if (frameCount % 60 == 0 && this.bufferEnemys.length >= 1) {
      this.enemys.set(this.enemys.size, <Enemy>this.bufferEnemys.shift());
    }
    // Update Enemies
    for (const [ key, enemy ] of this.enemys.entries()) {
      enemy.Update(deltaTime, this);
      if (enemy.dead) {
        this.enemys.delete(key);
      }
    }
    // Update Towers
    for (const [key, tower] of this.towers.entries()) {
      tower.Update(deltaTime, this);
      if (tower.dead) {
        this.towers.delete(key);
      }
    }
    // Update Particles
    for (const [ key, particle ] of this.particles.entries()) {
      particle.Update(deltaTime);
      if (particle.dead) {
        this.particles.delete(key);
      }
    }
    // Detect If The Wave is Over
    if (this.activeWave && this.enemys.size <= 0 && this.bufferEnemys.length <= 0) {
      // Wave is over
      this.activeWave = false;
      if(100 - (this.waveCount*5) > 0) this.money += 100 - (this.waveCount*5); // Give you a 100 dolar level completion bonus
      // Add A Segment
      this.waveEnded = true;
      for (let i = 0; i < 1; i++) {
        try {
          this.addSegment();
        } catch (err) {
        }
      }
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
      towers: this.towers
    };
  }
}