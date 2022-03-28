// Import Scss
import './style.scss';
// Import External Libs
import P5 from 'p5';
// Import Interal Libs
import Vector from './Game/Vector'; 
import World from './Game/World';
import AudioEngine from './Game/AudioEngine';
import { Dialog, Specials, Towers } from './Game/Data';
import { BackgroundType, EnemyType, ParticleType } from './Game/Types';
// Dom References
const menuScene = <HTMLElement>document.getElementById('Menu');
const gameScene = <HTMLElement>document.getElementById('Game');
const howScene = <HTMLElement>document.getElementById('HowToPlay');
const leaderboardScene = <HTMLElement>document.getElementById('LeaderBoard');
const creditScene = <HTMLElement>document.getElementById('CreditsScene');
// Page Buttons
const startButton = <HTMLElement>document.getElementById('StartBtn');
const howButton = <HTMLElement>document.getElementById('HowBtn');
const leaderboardButton = <HTMLElement>document.getElementById('LeaderBoardBtn');
const creditsButton = <HTMLElement>document.getElementById('CreditsBtn');
const homeButton_1 = <HTMLElement>document.getElementById('HomeBtn1');
const homeButton_2 = <HTMLElement>document.getElementById('HomeBtn2');
const homeButton_3 = <HTMLElement>document.getElementById('HomeBtn3');
// In Game Ui
const moneyCounts = <HTMLElement>document.getElementById('money');
const pauseOverlay = <HTMLElement>document.getElementById('pause-overlay');
const pauseGame = <HTMLElement>document.getElementById('pause-button');
const waveButton = <HTMLButtonElement>document.getElementById('nextwave');
const waveCount = <HTMLElement>document.getElementById('wave-count');
const msgBox = <HTMLElement>document.getElementById('msg');

const msgImage = <HTMLImageElement>document.getElementById('repler-image');
const msgName = <HTMLElement>document.getElementById('repler-name');
const msgText = <HTMLElement>document.getElementById('repler-message');
const advanceMessage = <HTMLElement>document.getElementById('nextmsg');

const storeButtonContainer = <HTMLElement>document.getElementById('centerbtn');
const towerStoreButton = <HTMLButtonElement>document.getElementById('tower-menu-btn');
const specialStoreButton = <HTMLButtonElement>document.getElementById('special-attack-btn');

const storeBody = <HTMLElement>document.getElementById('storeBody');
// Textures Enum
const enum Texture {
  Base,
  // Path Textures
  PathStraight,
  PathTurn,
  Path4Way,
  PathBase,
  // Enemy Textures
  Enemy_Boss_Gun_1,
  Enemy_Boss_Gun_2,
  Enemy_Boss_Main_1,
  Enemy_Boss_Main_2,
  Enemy_Gun_14,
  Enemy_Gun_13,
  Enemy_Gun_4,
  Enemy_Gun_6,
  Enemy_Gun_9,
  Enemy_Insect_Leg,
  Enemy_Leg_10,
  Enemy_Leg_12,
  Enemy_Main_1,
  Enemy_Main_2,
  Enemy_Main_3,
  Enemy_Main_4,
  Enemy_Main_5,
  Enemy_Main_6,
  Enemy_Main_7,
  Enemy_Main_8,
  Enemy_Main_9,
  Enemy_Main_10,
  Enemy_Main_11,
  Enemy_Main_12,
  Enemy_Main_13,
  Enemy_Main_14,
  Enemy_Main_15,
  Enemy_Main_16,
  Enemy_Main_17,
  Enemy_Main_18,
  Enemy_Wing_7,
  // General
  MoonBg
}
const enum StoreState {
  Tower,
  Special,
  Closed
}
// Start Menu Music
const audio = new AudioEngine();
audio.startMenuMusic();
// P5 Draw Loop
const startGame = () => {
  new P5(p5 => {
    // Global Variables
    const viewPort = new Vector(0, 0, 0); // x, y, scale
    const touchStart = new Vector(0, 0);
    const world = new World();
    const textures: Map<Texture, P5.Image> = new Map();
    let storeState: StoreState = StoreState.Closed;
    let activemessageIndex = 0;
    let fr = 0;
    // Preload some stuff
    p5.preload = async function preload() {
      // Load Image Helper
      const loadImage = (tex: Texture, path: string) => {
        textures.set(tex, p5.loadImage(`/src/assets/${path}`));
      };
      // Load Images
      loadImage(Texture.Base, 'base.png');
      
      loadImage(Texture.PathBase, 'misc/path-base.png');
      loadImage(Texture.PathStraight, 'misc/path-straight.png');
      loadImage(Texture.PathTurn, 'misc/path-corner.png');
      loadImage(Texture.Path4Way, 'misc/path-cross.png');

      loadImage(Texture.Enemy_Boss_Gun_1, 'enemies/enemy-boss-gun-1.png');
      loadImage(Texture.Enemy_Boss_Gun_2, 'enemies/enemy-boss-gun-2.png');
      loadImage(Texture.Enemy_Boss_Main_1, 'enemies/enemy-boss-main-1.png');
      loadImage(Texture.Enemy_Boss_Main_2, 'enemies/enemy-boss-main-2.png');
      loadImage(Texture.Enemy_Gun_14, 'enemies/enemy-gun-14.png');
      loadImage(Texture.Enemy_Gun_13, 'enemies/enemy-gun-13.png');
      loadImage(Texture.Enemy_Gun_4, 'enemies/enemy-gun-4.png');
      loadImage(Texture.Enemy_Gun_6, 'enemies/enemy-gun-6.png');
      loadImage(Texture.Enemy_Gun_9, 'enemies/enemy-gun-9.png');
      loadImage(Texture.Enemy_Insect_Leg, 'enemies/enemy-insect-leg.png');
      loadImage(Texture.Enemy_Leg_10, 'enemies/enemy-leg-10.png');
      loadImage(Texture.Enemy_Leg_12, 'enemies/enemy-leg-12.png');

      loadImage(Texture.Enemy_Main_1, 'enemies/enemy-main-1.png');
      loadImage(Texture.Enemy_Main_2, 'enemies/enemy-main-2.png');
      loadImage(Texture.Enemy_Main_3, 'enemies/enemy-main-3.png');
      loadImage(Texture.Enemy_Main_4, 'enemies/enemy-main-4.png');
      loadImage(Texture.Enemy_Main_5, 'enemies/enemy-main-5.png');
      loadImage(Texture.Enemy_Main_6, 'enemies/enemy-main-6.png');
      loadImage(Texture.Enemy_Main_7, 'enemies/enemy-main-7.png');
      loadImage(Texture.Enemy_Main_8, 'enemies/enemy-main-8.png');
      loadImage(Texture.Enemy_Main_9, 'enemies/enemy-main-9.png');
      loadImage(Texture.Enemy_Main_10, 'enemies/enemy-main-10.png');
      loadImage(Texture.Enemy_Main_11, 'enemies/enemy-main-11.png');
      loadImage(Texture.Enemy_Main_12, 'enemies/enemy-main-12.png');
      loadImage(Texture.Enemy_Main_13, 'enemies/enemy-main-13.png');
      loadImage(Texture.Enemy_Main_14, 'enemies/enemy-main-14.png');
      loadImage(Texture.Enemy_Main_15, 'enemies/enemy-main-15.png');
      loadImage(Texture.Enemy_Main_16, 'enemies/enemy-main-16.png');
      loadImage(Texture.Enemy_Main_17, 'enemies/enemy-main-17.png');
      loadImage(Texture.Enemy_Main_18, 'enemies/enemy-main-18.png');
      loadImage(Texture.Enemy_Wing_7, 'enemies/enemy-wing-7.png');
      loadImage(Texture.MoonBg, 'background.png');

    };
    // Setup Our Scene
    p5.setup = function setup() {
      // Game is loaded show it
      gameScene?.classList.remove('Hidden');
      // Create Canvas
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
      // Set The ViewPort
      viewPort.set(p5.width/2, p5.height/2, 1);
    };
    // Handle Resize
    p5.windowResized = function windowResized() {
      // TODO: Position Responsive
      viewPort.x = p5.map(viewPort.x, 0, p5.width, 0, p5.windowWidth);
      viewPort.y = p5.map(viewPort.y, 0, p5.height, 0, p5.windowHeight);
      // TODO: Scale Zoom
      // Resize Canvas
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };
    // Handle Control Input
    p5.touchStarted = function touchStarted({ touches }: TouchEvent) {
      if (world.paused) return;
      if(touches)
        touchStart.set(touches[0].pageX - viewPort.x, touches[0].pageY - viewPort.y);
    };
    p5.touchMoved = function mouseDragged(event: MouseEvent | TouchEvent) {
      if (world.paused) return;
      if (event instanceof MouseEvent) {
        // Mouse Input
        viewPort.x += event.movementX;
        viewPort.y += event.movementY;
      } else {
        viewPort.x = event.changedTouches[0].pageX - touchStart.x;
        viewPort.y = event.changedTouches[0].pageY - touchStart.y;
      }
    };
    p5.mouseWheel = function mouseWheel(event: WheelEvent) {
      if (world.paused) return;
      const diffX = p5.mouseX - viewPort.x;
      const diffY = p5.mouseY - viewPort.y;
      const scaleValue = p5.map(Math.sign(event.deltaY), -1, 1, 1.1, 0.9);
      const dxScaled = diffX * scaleValue;
      const dyScaled = diffY * scaleValue;
      viewPort.z *= scaleValue;
      viewPort.y -= (dyScaled - diffY);
      viewPort.x -= (dxScaled - diffX);
    };
    (<HTMLElement>document.getElementById('zoomin')).onclick = () => {
      if (world.paused) return;
      const diffX = p5.width/2 - viewPort.x;
      const diffY = p5.height/2 - viewPort.y;
      const scaleValue = 1.1;
      const dxScaled = diffX * scaleValue;
      const dyScaled = diffY * scaleValue;
      viewPort.z *= scaleValue;
      viewPort.y -= (dyScaled - diffY);
      viewPort.x -= (dxScaled - diffX);
    };
    (<HTMLElement>document.getElementById('zoomout')).onclick = () => {
      if (world.paused) return;
      const diffX = p5.width/2 - viewPort.x;
      const diffY = p5.height/2 - viewPort.y;
      const scaleValue = 0.9;
      const dxScaled = diffX * scaleValue;
      const dyScaled = diffY * scaleValue;
      viewPort.z *= scaleValue;
      viewPort.y -= (dyScaled - diffY);
      viewPort.x -= (dxScaled - diffX);
    };
    // Draw Function
    p5.draw = function draw() {
      if (world.paused) return;
      // Perform World Update
      world.Update(p5.deltaTime);
      // Drawing
      p5.push();
      // Clear The Screen
      p5.background(0);
      // Translate The map
      p5.translate(viewPort.x, viewPort.y);
      p5.scale(viewPort.z);
      // Draw The World
      const worldContents = world.getContents();
      for (const segment of worldContents.WorldSegmentList) {
        // Draw Outter Rectangle
        p5.image(textures.get(Texture.MoonBg), segment.x, segment.y, segment.width, segment.height);
        p5.noFill();
        p5.push();
        p5.translate(
          segment.x+segment.width/2, 
          segment.y+segment.height/2
        );
        p5.stroke(255);
        p5.imageMode(p5.CENTER);
        switch (segment.backgroundType) {
          case BackgroundType.PathBaseMoon:
            p5.image(
              textures.get(Texture.PathBase),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          case BackgroundType.PathStraightMoon:
            p5.image(
              textures.get(Texture.PathStraight),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          case BackgroundType.LeftTurnTopMoon:
            p5.rotate(Math.PI/180*180);
            p5.image(
              textures.get(Texture.PathTurn),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          case BackgroundType.RightTurnTopMoon:
            p5.rotate(Math.PI/180*270);
            p5.image(
              textures.get(Texture.PathTurn),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          case BackgroundType.LeftTurnBottomMoon:
            p5.rotate(Math.PI/180*90);
            p5.image(
              textures.get(Texture.PathTurn),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          case BackgroundType.RightTurnBottomMoon:
            p5.image(
              textures.get(Texture.PathTurn),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          case BackgroundType.Intersection4WayMoon:
            p5.image(
              textures.get(Texture.Path4Way),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          default:
            break;
        }
        p5.pop();
        // Draw Spline
        p5.stroke(0,0,0,75);
        for (const { points } of segment.paths) {
          p5.strokeWeight(10);
          p5.beginShape();
          p5.curveVertex(segment.x+points[0].x, segment.y+points[0].y);
          for (const point of points) {
            p5.curveVertex(segment.x+point.x, segment.y+point.y);
            p5.strokeWeight(20);
            p5.point(segment.x+point.x, segment.y+point.y);
            p5.strokeWeight(10);
          }
          p5.curveVertex(segment.x+points[points.length-1].x, segment.y+points[points.length-1].y);
          p5.endShape();
        }
        // Draw Castle
        if (segment.castlePosition != undefined) {
          p5.image(
            textures.get(Texture.Base),
            segment.castlePosition.x-75,
            segment.castlePosition.y-100,
            150,
            150
          );
          p5.noStroke();
          p5.fill(255,0,0);
          p5.rect(50, 10, 100, 10);
          p5.fill(70, 179, 115);
          p5.rect(50, 10, 100 * (world.baseHealth / 10), 10);
        }
        // Draw Decorations
      }
      const pa = Math.PI/180;
      // Draw Enemies
      for (const enemy of worldContents.enemys.values()) {
        const esize = enemy.scale; // in case enemies have diff sizes
        // Render Enemies
        p5.push();
        p5.translate(enemy.Position.x, enemy.Position.y);
        p5.scale(Math.round(-enemy.direction.x) < 0 ? -1 : 1,1);
        p5.scale(0.25 * esize);
        p5.translate(-200, -400);
        switch (enemy.EnemyType) {
          case EnemyType.Test:
            p5.strokeWeight(10);
            p5.stroke(255, 0, 0);
            p5.point(0,0);
            break;
          case EnemyType.Basic:
            p5.image(textures.get(Texture.Enemy_Main_1),0,0);
            break;
          case EnemyType.Fast:
            p5.image(textures.get(Texture.Enemy_Main_2),0,0);
            break;
          case EnemyType.Strong:
            p5.image(textures.get(Texture.Enemy_Main_3),0, 0);
            break;
          case EnemyType.Ultra:
            p5.image(textures.get(Texture.Enemy_Main_4),0, 0);
            p5.image(textures.get(Texture.Enemy_Gun_4), 0, 0);
            break;
          case EnemyType.Scorpion1: // just trying to fix rigging here
            p5.push();
            p5.translate(100, 175);
            p5.push();
            p5.translate(0,-p5.sin(p5.frameCount * pa) * 10);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(25,-p5.cos(p5.frameCount * pa) * 10);
            p5.scale(-p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,-p5.sin(p5.frameCount * pa) * 10);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_5), 0, 0);
            p5.push();
            p5.translate(100, 175);
            p5.push();
            p5.translate(0,p5.sin(p5.frameCount * pa) * 10);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(25,p5.cos(p5.frameCount * pa) * 10);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,p5.sin(p5.frameCount * pa) * 10);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            break;
          case EnemyType.Scorpion2:
            p5.push();
            p5.translate(100, 175);
            p5.push();
            p5.translate(0,-p5.sin(p5.frameCount * pa) * 10);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(25,-p5.cos(p5.frameCount * pa) * 10);
            p5.scale(-p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,-p5.sin(p5.frameCount * pa) * 10);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_6), 0, 0);
            p5.image(textures.get(Texture.Enemy_Gun_6), 0, 0);
            p5.push();
            p5.translate(100, 175);
            p5.push();
            p5.translate(0,p5.sin(p5.frameCount * pa) * 10);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(25,p5.cos(p5.frameCount * pa) * 10);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,p5.sin(p5.frameCount * pa) * 10);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            break;
          case EnemyType.Wasp:
            p5.push();
            p5.translate(200+20,200-80);
            p5.rotate(p5.sin(p5.frameCount * 25 * pa) * 15 * pa);
            p5.image(
              textures.get(Texture.Enemy_Wing_7),
              -160,
              -60 + (p5.sin(p5.frameCount * 2) * 10)
            );
            p5.rotate(2*-p5.sin(p5.frameCount * 25 * pa) * 15 * pa);
            p5.image(
              textures.get(Texture.Enemy_Wing_7), 
              -160, -60 + (p5.sin(p5.frameCount * 2) * 10)
            );
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_7), 0, p5.sin(p5.frameCount * 2 * pa) * 10);
            break;
          case EnemyType.TitanBeetle: 
            p5.image(textures.get(Texture.Enemy_Main_8), 0, 0);
            break;
          case EnemyType.Spider:
            p5.push();
            p5.translate(-130 + 200, 90 + 200);
            p5.push();
            p5.translate(0,-p5.sin(p5.frameCount * pa) * 10);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,-p5.cos(p5.frameCount * pa) * 10);
            p5.scale(-p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            p5.push();
            p5.translate(0 + 200,100 + 200);
            p5.push();
            p5.translate(0,-p5.sin(p5.frameCount * pa) * 10);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,0.75);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,-p5.cos(p5.frameCount * pa) * 10);
            p5.scale(-p5.cos(p5.frameCount * 2 * pa) * 0.5,0.75);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_9), 0, 0);
            p5.image(textures.get(Texture.Enemy_Gun_9), 0, 0);
            p5.push();
            p5.translate(-140 + 200, 90 + 200);
            p5.push();
            p5.translate(0,p5.sin(p5.frameCount * pa) * 10);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,p5.cos(p5.frameCount * pa) * 10);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            p5.push();
            p5.translate(0 + 200,100 + 200);
            p5.push();
            p5.translate(0,p5.sin(p5.frameCount * pa) * 10);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,0.75);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(50,p5.cos(p5.frameCount * pa) * 10);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,0.75);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.pop();
            break;
          case EnemyType.ShieldStrong:
            p5.push();
            p5.translate(-55  + 200,25 + 200);
            p5.rotate(p5.cos(p5.frameCount * 3 * pa) * 15 * pa);
            p5.image(textures.get(Texture.Enemy_Leg_10), -15,-15,100,200);
            p5.rotate(2 * -(p5.cos(p5.frameCount * 3 * pa) * 15 * pa));
            p5.image(textures.get(Texture.Enemy_Leg_10), -15,-15,100,200);
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_10), 0,0);
            break;
          case EnemyType.ShieldDefault:
            p5.push();
            p5.translate(-55  + 200,25 + 200);
            p5.rotate(p5.cos(p5.frameCount * 3 * pa) * 15 * pa);
            p5.image(textures.get(Texture.Enemy_Leg_10), -15,-15,100,200);
            p5.rotate(2 * -(p5.cos(p5.frameCount * 3 * pa) * 15 * pa));
            p5.image(textures.get(Texture.Enemy_Leg_10), -15,-15,100,200);
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_11), 0,0);
            break;
          case EnemyType.FireShield:
            p5.push();
            p5.translate(-55  + 200,25 + 200);
            p5.rotate(p5.cos(p5.frameCount * 3 * pa) * 15 * pa);
            p5.image(textures.get(Texture.Enemy_Leg_12), -15,-15,100,200);
            p5.rotate(2 * -(p5.cos(p5.frameCount * 3 * pa) * 15 * pa));
            p5.image(textures.get(Texture.Enemy_Leg_12), -15,-15,100,200);
            p5.pop();
            p5.image(Texture.Enemy_Main_12, 0,0);
            break;
          case EnemyType.FireShieldGunner:
            p5.push();
            p5.translate(-55  + 200,25 + 200);
            p5.rotate(p5.cos(p5.frameCount * 3 * pa) * 15 * pa);
            p5.image(textures.get(Texture.Enemy_Leg_12), -15,-15,100,200);
            p5.rotate(2 * -(p5.cos(p5.frameCount * 3 * pa) * 15 * pa));
            p5.image(textures.get(Texture.Enemy_Leg_12), -15,-15,100,200);
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_13), 0,0);
            p5.image(textures.get(Texture.Enemy_Gun_13), 0, 0);
            break;
          case EnemyType.Troll:
            p5.image(textures.get(Texture.Enemy_Main_14), 0,0);
            p5.image(textures.get(Texture.Enemy_Gun_14), 0, 0);
            break;
          case EnemyType.GhostMantis:
            p5.image(textures.get(Texture.Enemy_Main_15), 0,0);
            break;
          case EnemyType.Virus1:
            p5.image(textures.get(Texture.Enemy_Main_16), 0,0);
            break;
          case EnemyType.Virus2:
            p5.image(textures.get(Texture.Enemy_Main_17), 0,0);
            break;
          case EnemyType.Ship:
            p5.image(textures.get(Texture.Enemy_Main_18), 0,0,400,0.75 * 400);
            break;
          case EnemyType.Boss1:
            p5.image(textures.get(Texture.Enemy_Boss_Main_1), 0,0);
            p5.image(textures.get(Texture.Enemy_Boss_Gun_1), 0,0);
            break;
          case EnemyType.Boss2:
            p5.image(textures.get(Texture.Enemy_Boss_Main_2), 0,0);
            p5.image(textures.get(Texture.Enemy_Boss_Gun_2), 0,0);
            break;
        }
        p5.noStroke();
        p5.fill(255,0,0);
        p5.rect(10, 10, p5.map(enemy.maxHealth, 0, enemy.maxHealth, 0, 400), 10);
        p5.fill(70, 179, 115);
        p5.rect(10, 10, p5.map(enemy.health, 0, enemy.maxHealth, 0, 400), 10);
        p5.pop();
        
      }
      // Particle Drawing
      for (const particle of worldContents.particles.values()){
        p5.push();
        p5.translate(particle.Position.x, particle.Position.y);
        switch (particle.ParticleType){
          case ParticleType.Fire:
            p5.rectMode(p5.CENTER);
            p5.fill(255, 225, 0, particle.Opacity);
            p5.rect(0,0,particle.size,particle.size);
            break;
          default:
            console.log('TODO: You do not render this yet');
            break;
        }
        p5.pop();
      }
      // Draw Any Ui
      p5.pop();
      // Draw FrameRate
      if(p5.frameCount % 25 === 0)
        fr = p5.frameRate().toFixed(0);
      p5.text(fr, 20, 20);
      // Update elements
      moneyCounts.innerText = `${world.money}`;
      waveButton.disabled = world.activeWave || !msgBox.classList.contains('Hidden');
      if(world.waveEnded && !world.activeWave){
        console.log("Ended")
        setMessage();
        world.unend();
      }
    };
    // Add Buttons
    const toggleGamePause = (forcePause = false) => {
      if (forcePause) world.paused = true;
      if (!world.paused) {
        pauseGame.innerText = '►';
        audio.pauseMusic();
      } else {
        pauseGame.innerText = '||';
        audio.resumeMusic();
      }
      pauseOverlay.classList.toggle('Hidden', world.paused);
      world.paused = !world.paused;
    };
    pauseGame.onclick = () => {
      audio.clickEffect();
      toggleGamePause();
    };
    const setMessage = () => {
      if (
        Dialog[world.waveCount] == undefined ||
        Dialog[world.waveCount][activemessageIndex] == undefined
      ) {
        return msgBox.classList.add('Hidden');
      }
      const activeMessage = Dialog[world.waveCount][activemessageIndex];
      msgImage.src = `/src/assets/replers/${activeMessage.image}`;
      msgName.innerText = activeMessage.name;
      msgText.innerText = activeMessage.message;
      msgBox.classList.remove('Hidden');
    };
    waveButton.onclick = () => {
      if (msgBox.classList.contains('Hidden')) {
        world.newWave();
        waveCount.innerText = `${world.waveCount}`;
        //msgBox.classList.remove('Hidden');
        activemessageIndex = 0;
        //setMessage()
    
      }
    };
    advanceMessage.onclick = () => {
      activemessageIndex++;
      setMessage();
    };
    //setMessage();
    const toggleStore = (_storeState: StoreState) => {
      // Remove Event Listener
      if (storeState == _storeState) storeState = StoreState.Closed;
      else storeState = _storeState;
      storeBody.classList.toggle('Hidden', storeState == StoreState.Closed);
      storeButtonContainer.classList.toggle('up', !storeBody.classList.contains('Hidden'));
      // Add Store Elements
      const storeShelf = <HTMLElement>storeBody.querySelector('.tflex');
      const storeData = _storeState == StoreState.Tower ? Towers : Specials;
      storeShelf.innerHTML = '';
      for (const [ itemName, shelfItem ] of storeData.entries()) {
        // Build Html Element
        storeShelf.insertAdjacentHTML('beforeend', `
          <div class="topt opt" itemtype="${itemName}">
            <div class="tname">${shelfItem.name} - $${shelfItem.cost}</div>
            <img src="/src/assets/${shelfItem.image}">
          </div>
        `);
      }
      for (const child of <HTMLElement[]>Array.from(storeShelf.children)) {
        child.onclick = () => {
          const item = <string>child.getAttribute('itemtype');
          console.log(`Purchase Type: ${item}, isTower? ${storeState}`);
        };
      }
    };
    towerStoreButton.onclick = () => toggleStore(StoreState.Tower);
    specialStoreButton.onclick = () => toggleStore(StoreState.Special);
    document.addEventListener('visibilitychange', (event) => {
      if (document.hidden) toggleGamePause();
    });
  }, gameScene ?? undefined);
};
const enum Button {
  Start,
  How,
  Credits,
  Home,
  Leaderboard
}
const menuButtonPressed = (btn: Button) => {
  // Hide Other Pages
  document.querySelectorAll('#app > section').forEach(scene => scene.classList.add('Hidden'));
  // Show Page
  switch (btn) {
    case Button.Start:
      gameScene.classList.remove('Hidden');
      audio.startGameMusic();
      startGame();
      break;
    case Button.How:
      howScene.classList.remove('Hidden');
      break;
    case Button.Credits:
      creditScene.classList.remove('Hidden');
      break;
    case Button.Leaderboard:
      leaderboardScene.classList.remove('Hidden');
      break;
    case Button.Home:
      menuScene.classList.remove('Hidden');
      break;
  }
};
startButton.onclick = () => menuButtonPressed(Button.Start);
howButton.onclick = () => menuButtonPressed(Button.How);
leaderboardButton.onclick = () => menuButtonPressed(Button.Leaderboard);
creditsButton.onclick = () => menuButtonPressed(Button.Credits);
homeButton_1.onclick = () => menuButtonPressed(Button.Home);
homeButton_2.onclick = () => menuButtonPressed(Button.Home);
homeButton_3.onclick = () => menuButtonPressed(Button.Home);
// Button effect
document.querySelectorAll('button').forEach((elm) => {
  elm.addEventListener('click', () => audio.clickEffect());
});