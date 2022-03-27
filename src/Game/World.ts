// Import Types
import { WorldSegment, WorldContents, WorldSegmentContents, Side } from './Types';
// Import Modules
import Random from './Random';
import Vector from './Vector';
import { generateWorldSegment, segmentTypeList } from './WorldSegment';
import Enemy, { EnemyTypes } from './Enemy';

// TODO: Give Segments Entrance And Exits so that we always have a path back home
// World Class
export default class World {
  public paused: boolean = false;
  public money: number = 10;
  public waveCount: number = 0;
  public activeWave: boolean = false;
  public WorldSegmentList: WorldSegmentContents[] = [];
  // Properties
  private seed: number;
  private worldGenerator: Random;
  private enemys: Enemy[] = [];
  // Constructor
  constructor () {
    // Initalize Random Generator
    // this.seed = Math.random();
    this.seed = 0.01608666435702122;
    this.worldGenerator = new Random(this.seed);
    // Spawn Initial Segment
    this.addSegment();
    for (let i = 0; i < 5; i++) {
      try {
        this.addSegment();
      } catch (err) {
        console.log(err);
      }
    }
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
        (freeSide.top && choosenSegment.freeSide.bottom) ||
        (freeSide.bottom && choosenSegment.freeSide.top) ||
        (freeSide.left && choosenSegment.freeSide.right) ||
        (freeSide.right && choosenSegment.freeSide.left)
      );
    });
    if (choosableWorldSegments.length == 0 && this.WorldSegmentList.length != 0) {
      // We need to narrow down our choices
      const openWorldSegments = this.WorldSegmentList.filter(({ freeSide }) => {
        return (freeSide.top || freeSide.bottom || freeSide.left || freeSide.right);
      });
      choosableSegmentTypes = choosableSegmentTypes.filter((testSegment) => {
        return openWorldSegments.some(({ freeSide }) => {
          return (
            (freeSide.top && testSegment.freeSide.bottom) ||
            (freeSide.bottom && testSegment.freeSide.top) ||
            (freeSide.left && testSegment.freeSide.right) ||
            (freeSide.right && testSegment.freeSide.left)
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
        (choosenAttachement.freeSide.top && choosenSegment.freeSide.bottom) ? Side.Top : null,
        (choosenAttachement.freeSide.bottom && choosenSegment.freeSide.top) ? Side.Bottom : null,
        (choosenAttachement.freeSide.left && choosenSegment.freeSide.right) ? Side.Left : null,
        (choosenAttachement.freeSide.right && choosenSegment.freeSide.left) ? Side.Right : null,
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
    // TODO: Invalid the segment here instead so we dont get dead ends
    if (choosenSegment.freeSide.top) {
      const segmentAtPos = this.WorldSegmentList.some((segment) =>
        segment.x == x && segment.y == y-choosenSegment.height
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) worldSegment.freeSide.top = false;
    }
    if (choosenSegment.freeSide.bottom) {
      const segmentAtPos = this.WorldSegmentList.some((segment) =>
        segment.x == x && segment.y == y+choosenSegment.height
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) worldSegment.freeSide.bottom = false;
    }
    if (choosenSegment.freeSide.left) {
      const segmentAtPos = this.WorldSegmentList.some((segment) =>
        segment.x == x-choosenSegment.width && segment.y == y
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) worldSegment.freeSide.left = false;
    }
    if (choosenSegment.freeSide.right) {
      const segmentAtPos = this.WorldSegmentList.some((segment) =>
        segment.x == x+choosenSegment.width && segment.y == y
      );
      if (segmentAtPos && trys < 10)
        return this.addSegment(trys + 1, choosableSegmentTypes);
      if (segmentAtPos) worldSegment.freeSide.right = false;
    }
    if (
      !(
        worldSegment.freeSide.top ||
        worldSegment.freeSide.bottom ||
        worldSegment.freeSide.left ||
        worldSegment.freeSide.right
      )
      // TODO: remove from the list of possible segments
    ) return this.addSegment(trys + 1, choosableSegmentTypes);
    // Toggle Attachment
    if (choosenAttachement && side == Side.Top)
      choosenAttachement.freeSide.top = false;
    else if (choosenAttachement && side == Side.Bottom)
      choosenAttachement.freeSide.bottom = false;
    else if (choosenAttachement && side == Side.Left)
      choosenAttachement.freeSide.left = false;
    else if (choosenAttachement && side == Side.Right)
      choosenAttachement.freeSide.right = false;
    // Push Segment To Array
    this.WorldSegmentList.push(worldSegment);
  }
  private getPath(segment: WorldSegmentContents, lastPoint: Vector): Vector[] {
    // Find Closest Point
    let closestDistance = Number.MAX_SAFE_INTEGER;
    let closestPath: Vector[] = [];
    for (const path of segment.paths) {
      // Check First Point
      const startDistance = path[0].distanceToSquared(lastPoint);
      if (startDistance < closestDistance) {
        closestDistance = startDistance;
        closestPath = path;
      }
      // Check Last Point
      const endDistance = path[path.length-1].distanceToSquared(lastPoint);
      if (endDistance < closestDistance) {
        closestDistance = endDistance;
        closestPath = path.reverse();
      }
    }
    return closestPath.map((vec) => vec.clone().add(segment.x, segment.y));
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
        return (
          segment.freeSide.top ||
          segment.freeSide.bottom ||
          segment.freeSide.left ||
          segment.freeSide.right 
        );
      });
      const segmentChoice = this.worldGenerator.nextRandomChoice(openSegments);
      // Choose Side
      const freeSides = [
        segmentChoice.freeSide.top ? Side.Top : null,
        segmentChoice.freeSide.bottom ? Side.Bottom : null,
        segmentChoice.freeSide.left ? Side.Left : null,
        segmentChoice.freeSide.right ? Side.Right : null,
      ].filter(n => n != null);
      // Only Pick A Free Side
      const choosenSide = this.worldGenerator.nextRandomChoice(freeSides);
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
      this.enemys.push(
        new enemyChoice(pathInformation[0], pathInformation)
      );
      console.log(difficultyLevel);
      // Once we run out of points break
      if (difficultyLevel <= 0) break;
    }
  }
  public Update(deltaTime: number): void {
    // Update Enemies
    for (const enemy of this.enemys) {
      enemy.Update(deltaTime, this);
    }
    // TODO: Update Towers
    // Detect If The Wave is Over
    if (this.activeWave && this.enemys.length <= 0) {
      // Wave is over
      this.activeWave = false;
      this.money += 100; // Give you a 100 dolar level completion bonus
      // Add A Segment
      this.addSegment();
    }
  }
  // Render & Export Function
  public getContents (): WorldContents {
    return {
      seed: this.seed,
      wave: this.waveCount,
      WorldSegmentList: this.WorldSegmentList,
      enemys: this.enemys,
      // Towers: any[];
      // Money: number;
    };
  }
}