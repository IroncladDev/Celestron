// Import Types
import Vector from './Vector';
import Enemy from './Enemy';
import Tower from './Tower';
import Particle from './Particle';
// Sides
export const enum Side {
  Top,
  Bottom,
  Left,
  Right
}
// Target Type
export const enum TargetType {
  Random,
  Closest,
  Strongest,
  Farthest
}
// Specials
export const enum Specials {
  Test,
}
// Towers
export const enum TowerType {
  Basic,
  Machine,
  RailGun,
}
// Background
export const enum BackgroundType {
  Moon,
  PathBaseMoon,
  PathTeeMoon,
  PathStraightVerticalMoon,
  PathStraightHorizontalMoon,
  LeftTurnTopMoon,
  RightTurnTopMoon,
  LeftTurnBottomMoon,
  RightTurnBottomMoon,
  Intersection4WayMoon
}
// Enemys
export const enum EnemyType {
  Test,
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
}
// Decorations
export const enum DecorationType {
  Path,
  Altar,
  Beacon,
  Database,
  Drive,
  Fence,
  Rocks,
  Satellite,
  Spikes,
  Tanker
}
export interface DecorationDefinition {
  decorationType: DecorationType;
  position: Vector;
}
// World Segment Contents
export interface SegmentPath {
  points: Vector[];
  pathSides: Set<Side>;
  entranceSegment?: WorldSegmentContents;
  exitSegment?: WorldSegmentContents;
  segment?: WorldSegmentContents;
} 
export interface WorldSegment {
  width: number;
  height: number;
  canSpawn?: (
    x: number,
    y: number,
    side: Side,
    worldSegmentList: WorldSegmentContents[]
  ) => boolean;
  backgroundType: BackgroundType;
  castlePosition?: Vector;
  paths: SegmentPath[];
  decorations: DecorationDefinition[];
  freeSide: Set<Side>;
}
export interface WorldSegmentContents {
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundType: BackgroundType;
  decorations: DecorationDefinition[];
  castlePosition?: Vector;
  paths: SegmentPath[];
  freeSide: Set<Side>;
}
// World Contents
export interface WorldContents {
  seed: number;
  wave: number;
  WorldSegmentList: WorldSegmentContents[];
  enemys: Map<number, Enemy>;
  particles: Map<number, Particle>;
  towers: Map<number, Tower>;
}

export const enum ParticleType{
  Fire,
  Smoke,
  Spark,
  Bullet,
  MgunBullet,
  RailgunBullet
}