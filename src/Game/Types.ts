// Import Types
import Vector from './Vector';
import { enemys } from './Enemy';
// Sides
export const enum Side {
  Top,
  Bottom,
  Left,
  Right
}
// Background
export const enum BackgroundType {
  Moon,
  PathBaseMoon,
  PathStraightMoon,
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
}
// Decorations
export const enum DecorationType {
  Path,
}
export interface DecorationDefinition {
  decorationType: DecorationType;
  position: Vector;
}
// World Segment Contents
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
  paths: Vector[][];
  decorations: DecorationDefinition[];
  freeSide: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}
export interface WorldSegmentContents {
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundType: BackgroundType;
  decorations: DecorationDefinition[];
  castlePosition?: Vector;
  paths: Vector[][];
  freeSide: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}
// World Contents
export interface WorldContents {
  seed: number;
  wave: number;
  WorldSegmentList: WorldSegmentContents[];
  enemys: Enemy[];
  // Towers: any[];
  // Money: number;
}