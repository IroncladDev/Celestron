// Type Imports
import { WorldSegmentContents, WorldSegment, BackgroundType, Side } from './Types';
import Vector from './Vector';
// General Properties
const width = 200;
const height = 200;
// Spline Generator
export const getCurvePoints = (
  points: Vector[],
  tension: number = 0.5,
  isClosed: boolean = false,
  numOfSegments: number = 16
): Vector[] => {
  // use input value if provided, or use a default value   
  const res = [];
  // The algorithm require a previous and next point to the actual point array.
  // Check if we will draw closed or open curve.
  // If closed, copy end points to beginning and first points to end
  // If open, duplicate first points to befinning, end points to end
  if (isClosed) {
    points.unshift(points[points.length - 1]);
    points.unshift(points[points.length - 1]);
    points.push(points[0]);
  } else {
    points.unshift(points[0]);   //copy 1. point and insert at beginning
    points.push(points[points.length - 1]); //copy last point and append
  }
  // ok, lets start..
  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (let i=1; i < (points.length - 2); i++) {
    for (let t=0; t <= numOfSegments; t++) {
      // calc tension vectors
      const t1x = (points[i+1].x - points[i-1].x) * tension;
      const t2x = (points[i+2].x - points[i].x) * tension;
      const t1y = (points[i+1].y - points[i-1].y) * tension;
      const t2y = (points[i+2].y - points[i].y) * tension;
      // calc step
      const st = t / numOfSegments;
      // calc cardinals
      const c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
      const c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
      const c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
      const c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);
      // calc x and y cords with common control vectors and store in array
      res.push(new Vector(
        c1 * points[i].x + c2 * points[i+1].x + c3 * t1x + c4 * t2x,
        c1 * points[i].y + c2 * points[i+1].y + c3 * t1y + c4 * t2y
      ));
    }
  }
  return res;
}
// WorldSegments
export const generateWorldSegment = (
  x: number,
  y: number,
  side: Side,
  segmentType: WorldSegment,
  worldSegmentList: WorldSegmentContents[],
): WorldSegmentContents | false => {
  if (segmentType.canSpawn && !segmentType!.canSpawn(x, y, side, worldSegmentList))
    return false;
  // Make New Cell
  const cell = {
    x: x,
    y: y,
    width: segmentType.width,
    height: segmentType.height,
    backgroundType: segmentType.backgroundType,
    castlePosition: segmentType.castlePosition,
    paths: segmentType.paths,
    decorations: segmentType.decorations,
    freeSide: new Set(segmentType.freeSide)
  };
  // Set Free Side
  if (side == Side.Top) cell.freeSide.delete(Side.Bottom);
  else if (side == Side.Bottom) cell.freeSide.delete(Side.Top);
  else if (side == Side.Left) cell.freeSide.delete(Side.Right);
  else if (side == Side.Right) cell.freeSide.delete(Side.Left);
  // Return Value
  return cell;
};
// Segment Types
export const segmentTypeList: WorldSegment[] = [
  {
    width: width,
    height: height,
    backgroundType: BackgroundType.PathBaseMoon,
    castlePosition: new Vector(width/2, height/2),
    paths: [
      {
        points: [
          new Vector(width/2, height),
          new Vector(width/2, height/2)
        ],
        pathSides: new Set([
          Side.Bottom
        ])
      }
    ],
    decorations: [],
    freeSide: new Set([
      Side.Bottom
    ])
  },
  {
    width: width,
    height: height,
    backgroundType: BackgroundType.PathStraightMoon,
    paths: [
      {
        points: [
          new Vector(width/2, height),
          new Vector(width/2, 0) 
        ],
        pathSides: new Set([
          Side.Top,
          Side.Bottom
        ])
      }
    ],
    decorations: [],
    freeSide: new Set([
      Side.Top,
      Side.Bottom
    ])
  },
  {
    width: width,
    height: height,
    backgroundType: BackgroundType.LeftTurnTopMoon,
    paths: [
      {
        points: [
          new Vector(width/2, 0),
          new Vector(width/2, height*0.35),
          new Vector(width*0.35, height/2),
          new Vector(0, height/2) 
        ],
        pathSides: new Set([
          Side.Top,
          Side.Left
        ])
      }
    ],
    decorations: [],
    freeSide: new Set([
      Side.Top,
      Side.Left
    ])
  },
  {
    width: width,
    height: height,
    backgroundType: BackgroundType.RightTurnTopMoon,
    paths: [
      {
        points: [
          new Vector(width/2, 0),
          new Vector(width/2, height*0.35),
          new Vector(width*0.65, height/2),
          new Vector(width, height/2) 
        ],
        pathSides: new Set([
          Side.Top,
          Side.Right
        ])
      }
    ],
    decorations: [],
    freeSide: new Set([
      Side.Top,
      Side.Right
    ])
  },
  {
    width: width,
    height: height,
    backgroundType: BackgroundType.LeftTurnBottomMoon,
    paths: [
      {
        points: [
          new Vector(width/2, height),
          new Vector(width/2, height*0.65),
          new Vector(width*0.35, height/2),
          new Vector(0, height/2) 
        ],
        pathSides: new Set([
          Side.Bottom,
          Side.Left
        ])
      }
    ],
    decorations: [],
    freeSide: new Set([
      Side.Bottom,
      Side.Left
    ])
  },
  {
    width: width,
    height: height,
    backgroundType: BackgroundType.RightTurnBottomMoon,
    paths: [
      {
        points: [
          new Vector(width/2, height),
          new Vector(width/2, height*0.65),
          new Vector(width*0.65, height/2),
          new Vector(width, height/2) 
        ],
        pathSides: new Set([
          Side.Bottom,
          Side.Right
        ])
      }
    ],
    decorations: [],
    freeSide: new Set([
      Side.Bottom,
      Side.Right
    ])
  },
  // TODO: Figure out how to path find these
  // {
  //   width: width,
  //   height: height,
  //   backgroundType: BackgroundType.Intersection4WayMoon,
  //   paths: [
  //     [
  //       new Vector(width/2, 0),
  //       new Vector(width/2, height)
  //     ],
  //     [
  //       new Vector(0, height/2),
  //       new Vector(width, height/2)
  //     ]
  //   ],
  //   decorations: [],
  //   freeSide: {
  //     top: true,
  //     bottom: true,
  //     left: true,
  //     right: true,
  //   },
  // }
];