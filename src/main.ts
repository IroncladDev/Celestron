// Import Scss
import './style.scss';
// Import External Libs
import P5 from 'p5';
// Import Interal Libs
import Vector from './Game/Vector'; 
import World from './Game/World';
import AudioEngine from './Game/AudioEngine';
import { Dialog, SpecialsShelf, TowersShelf, StoreItem } from './Game/Data';
import { BackgroundType, EnemyType, ParticleType, DecorationType , TowerType } from './Game/Types';
import Tower from './Game/Tower';
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
const homeButton_4 = <HTMLElement>document.getElementById('HomeBtn4');
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
const authorizeReplit = <HTMLElement>document.getElementById('login-replit-btn');
const loginOverlay = <HTMLElement>document.getElementById('login-overlay');
const loginModal = <HTMLElement>document.getElementById('login-modal');
const closeLogin = <HTMLElement>document.getElementById('close-login-btn');
const openLogin = <HTMLElement>document.getElementById('login-button');
const loggedInIndicator = <HTMLElement>document.getElementById('loggedin-indicator');
const usernameIndicator = <HTMLElement>document.getElementById('username-indicator');

const speedButton = <HTMLElement>document.getElementById('speed');
// Textures Enum
const enum Texture {
  Base,
  // Path Textures
  PathStraight,
  PathTee,
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
  // Towers
  Tower_Basic_Base_0,
  Tower_Basic_Base_1,
  Tower_Basic_Base_2,
  Tower_Basic_Base_3,
  Tower_Basic_Turret_0,
  Tower_Basic_Turret_1,
  Tower_Basic_Turret_2,
  Tower_Basic_Turret_3,
  Tower_Basic_Barrel_0,
  Tower_Basic_Barrel_1,
  Tower_Basic_Barrel_2,
  Tower_Basic_Barrel_3,
  
  Tower_Machine_Base_0,
  Tower_Machine_Base_1,
  Tower_Machine_Base_2,
  Tower_Machine_Base_3,
  Tower_Machine_Turret_0,
  Tower_Machine_Turret_1,
  Tower_Machine_Turret_2,
  Tower_Machine_Turret_3,
  Tower_Machine_Barrel_0,
  Tower_Machine_Barrel_1,
  Tower_Machine_Barrel_2,
  Tower_Machine_Barrel_3,

  
  Tower_RailGun_Base_0,
  Tower_RailGun_Base_1,
  Tower_RailGun_Base_2,
  Tower_RailGun_Base_3,
  Tower_RailGun_Turret_0,
  Tower_RailGun_Turret_1,
  Tower_RailGun_Turret_2,
  Tower_RailGun_Turret_3,
  Tower_RailGun_Barrel_0,
  Tower_RailGun_Barrel_1,
  Tower_RailGun_Barrel_2,
  Tower_RailGun_Barrel_3,
  // General
  MoonBg,
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
    const world = new World(audio);
    const textures: Map<Texture, P5.Image> = new Map();
    let storeState: StoreState = StoreState.Closed;
    let activemessageIndex = 0;
    let fr = 0;
    let activeTowerPlacement: StoreItem | null = null;
    // Load Image Helper
    const loadImage = (tex: Texture, path: string) => {
      textures.set(tex, p5.loadImage(`/src/assets/${path}`));
    };
    // Preload some stuff
    p5.preload = async function preload() {
      // Load Images
      loadImage(Texture.Base, 'base.png');
      
      loadImage(Texture.PathBase, 'misc/path-base.png');
      loadImage(Texture.PathTee, 'misc/path-t.png');
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
      loadImage(Texture.Altar, 'misc/decoration-altar.png');
      loadImage(Texture.Beacon, 'misc/decoration-beacon.png');
      loadImage(Texture.Database, 'misc/decoration-database.png');
      loadImage(Texture.Drive, 'misc/decoration-drive.png');
      loadImage(Texture.Fence, 'misc/decoration-fence.png');
      loadImage(Texture.Rocks, 'misc/decoration-rocks.png');
      loadImage(Texture.Satellite, 'misc/decoration-satellite.png');
      loadImage(Texture.Spikes, 'misc/decoration-spikes.png');
      loadImage(Texture.Tanker, 'misc/decoration-tanker.png');
    };
    // Setup Our Scene
    p5.setup = function setup() {
      // Load Images
      loadImage(Texture.Tower_Basic_Base_0, 'towers/tower-base-0.png');
      loadImage(Texture.Tower_Basic_Base_1, 'towers/tower-base-1.png');
      loadImage(Texture.Tower_Basic_Base_2, 'towers/tower-base-2.png');
      loadImage(Texture.Tower_Basic_Base_3, 'towers/tower-base-3.png');
      loadImage(Texture.Tower_Basic_Turret_0, 'towers/tower-turret-0.png');
      loadImage(Texture.Tower_Basic_Turret_1, 'towers/tower-turret-1.png');
      loadImage(Texture.Tower_Basic_Turret_2, 'towers/tower-turret-2.png');
      loadImage(Texture.Tower_Basic_Turret_3, 'towers/tower-turret-3.png');
      loadImage(Texture.Tower_Basic_Barrel_0, 'towers/tower-barrel-0.png');
      loadImage(Texture.Tower_Basic_Barrel_1, 'towers/tower-barrel-1.png');
      loadImage(Texture.Tower_Basic_Barrel_2, 'towers/tower-barrel-2.png');
      loadImage(Texture.Tower_Basic_Barrel_3, 'towers/tower-barrel-3.png');

      loadImage(Texture.Tower_Machine_Base_0, 'towers/mgun-base-0.png');
      loadImage(Texture.Tower_Machine_Base_1, 'towers/mgun-base-1.png');
      loadImage(Texture.Tower_Machine_Base_2, 'towers/mgun-base-2.png');
      loadImage(Texture.Tower_Machine_Base_3, 'towers/mgun-base-3.png');
      loadImage(Texture.Tower_Machine_Turret_0, 'towers/mgun-turret-0.png');
      loadImage(Texture.Tower_Machine_Turret_1, 'towers/mgun-turret-1.png');
      loadImage(Texture.Tower_Machine_Turret_2, 'towers/mgun-turret-2.png');
      loadImage(Texture.Tower_Machine_Turret_3, 'towers/mgun-turret-3.png');
      loadImage(Texture.Tower_Machine_Barrel_0, 'towers/mgun-barrel-0.png');
      loadImage(Texture.Tower_Machine_Barrel_1, 'towers/mgun-barrel-1.png');
      loadImage(Texture.Tower_Machine_Barrel_2, 'towers/mgun-barrel-2.png');
      loadImage(Texture.Tower_Machine_Barrel_3, 'towers/mgun-barrel-3.png');

      loadImage(Texture.Tower_RailGun_Base_0, 'towers/railgun-base-0.png');
      loadImage(Texture.Tower_RailGun_Base_1, 'towers/railgun-base-1.png');
      loadImage(Texture.Tower_RailGun_Base_2, 'towers/railgun-base-2.png');
      loadImage(Texture.Tower_RailGun_Base_3, 'towers/railgun-base-3.png');
      loadImage(Texture.Tower_RailGun_Turret_0, 'towers/railgun-turret-0.png');
      loadImage(Texture.Tower_RailGun_Turret_1, 'towers/railgun-turret-1.png');
      loadImage(Texture.Tower_RailGun_Turret_2, 'towers/railgun-turret-2.png');
      loadImage(Texture.Tower_RailGun_Turret_3, 'towers/railgun-turret-3.png');
      loadImage(Texture.Tower_RailGun_Barrel_0, 'towers/railgun-barrel-0.png');
      loadImage(Texture.Tower_RailGun_Barrel_1, 'towers/railgun-barrel-1.png');
      loadImage(Texture.Tower_RailGun_Barrel_2, 'towers/railgun-barrel-2.png');
      loadImage(Texture.Tower_RailGun_Barrel_3, 'towers/railgun-barrel-3.png');
      // Game is loaded show it
      gameScene?.classList.remove('Hidden');
      // Create Canvas
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
      //p5.pixelDensity(2)
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
      if (touches)
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
    p5.mouseReleased = function mouseReleased(event: MouseEvent) {
      if (activeTowerPlacement && world.towerMouse && event.button == 0) {
        if ((<any>event).path) {
          for (const elm of (<any>event).path) {
            if (elm.classList && elm.classList.contains('tflex')) return;
          } 
        }
        // Verify Spawn
        const segX = Math.floor(world.towerMouse.Position.x/200)*200;
        const segY = Math.floor(world.towerMouse.Position.y/200)*200;
        if (world.getSegment(segX, segY) == undefined) {
          audio.effect('error.mp3', 0.5);
          return;
        }
        // Charge Money
        if (world.money < activeTowerPlacement.cost) return;
        world.money -= activeTowerPlacement.cost;
        // Spawn And Clear
        world.towers.set(world.towers.size, world.towerMouse);
        world.towerMouse = null;
        activeTowerPlacement = null;
        updateStore();
      }
    };
    p5.mouseWheel = function mouseWheel(event: WheelEvent) {
      if (world.paused) return;
      if ((<any>event).path) {
        for (const elm of (<any>event).path) {
          if (elm.classList && elm.classList.contains('tflex')) return;
        } 
      }
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
    let sellTime = 0;
    p5.draw = async function draw() {
      if (world.paused || world.gameOver) return;
      // Perform World Update
      let localMoney = world.money;
      world.Update(p5.deltaTime, p5.frameCount);
      p5.background(0);
      p5.push();
      p5.translate(viewPort.x, viewPort.y);
      p5.scale(viewPort.z);
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
        p5.noStroke();
        p5.imageMode(p5.CENTER);
        for(const dec of segment.decorations){
          switch(dec.decorationType){
            case DecorationType.Altar:
              p5.image(textures.get(Texture.Altar), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Beacon:
              p5.image(textures.get(Texture.Beacon), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Database:
              p5.image(textures.get(Texture.Database), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Drive:
              p5.image(textures.get(Texture.Drive), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Fence:
              p5.image(textures.get(Texture.Fence), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Rocks:
              p5.image(textures.get(Texture.Rocks), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Satellite:
              p5.image(textures.get(Texture.Satellite), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Spikes:
              p5.image(textures.get(Texture.Spikes), dec.position.x, dec.position.y, 50, 50);
              break;
            case DecorationType.Tanker:
              p5.image(textures.get(Texture.Tanker), dec.position.x, dec.position.y, 50, 50);
              break;
          }
        }
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
          case BackgroundType.PathStraightHorizontalMoon:
            p5.rotate(Math.PI/180*90);
          case BackgroundType.PathStraightVerticalMoon:
            p5.image(
              textures.get(Texture.PathStraight),
              0,
              0,
              segment.width,
              segment.height
            );
            break;
          case BackgroundType.LeftTurnTopMoon:
            p5.rotate(Math.PI/180*-90);
          case BackgroundType.RightTurnTopMoon:
            p5.rotate(Math.PI/180*180);
          case BackgroundType.LeftTurnBottomMoon:
            p5.rotate(Math.PI/180*90);
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
          p5.rect(50, 10, Math.max(100 * (world.baseHealth / 10), 0), 10);
        }
        // Draw Decorations
      }
      const pa = Math.PI/180;
      const Mouse = {
        x: (p5.mouseX - viewPort.x) * (1/viewPort.z),
        y: (p5.mouseY - viewPort.y) * (1/viewPort.z)
      };
      const drawTower = (tower: Tower, range: boolean = false, menu: boolean = false) => {
        p5.push();
        if(range){
          const rotation = -p5.frameCount / 75;
          p5.fill(0,0,0,0);
          p5.stroke(0,225,255,75);
          p5.strokeWeight(2);
          p5.strokeCap(p5.SQUARE);
          p5.circle(0, 0, tower.range * 2);
          p5.strokeWeight(5);
          p5.arc(0,0,tower.range * 2 +6,tower.range * 2+6,-Math.PI/4 + rotation,Math.PI/4 + rotation);
          p5.arc(0,0,tower.range * 2+6,tower.range * 2+6,(-Math.PI/4 + Math.PI) + rotation, (Math.PI/4 + Math.PI) + rotation);
          p5.arc(0,0,tower.range * 2+6,tower.range * 2+6,-Math.PI/8 - rotation,Math.PI/8 - rotation);
          p5.arc(0,0,tower.range * 2+6,tower.range * 2+6,(-Math.PI/8 + Math.PI) - rotation, (Math.PI/8 + Math.PI) - rotation);
          p5.arc(0,0,tower.range * 2-6,tower.range * 2-6,-Math.PI/8 + Math.PI + Math.PI/2 + rotation,Math.PI/8 + Math.PI + Math.PI/2 + rotation);
          p5.arc(0,0,tower.range * 2-6,tower.range * 2-6,(-Math.PI/8 + Math.PI/2) + rotation, (Math.PI/8 + Math.PI/2) + rotation);
        }
        if(menu && world.towerMouse == null){
          p5.rectMode(p5.CENTER);
          p5.fill(200, 50, 0, 100);
          if(Mouse.x > tower.Position.x - 30 && Mouse.x < tower.Position.x + 30 && Mouse.y > tower.Position.y - 55 && Mouse.y < tower.Position.y + 15 - 40){
            p5.fill(200, 50, 0, 150);
            if(p5.mouseIsPressed){
              sellTime+=2;
              if(sellTime >= 80){
                world.money += Math.round(tower.cost * 0.75);
                tower.dead = true;
                updateStore();
                sellTime = 0;
              }
            } else sellTime = 0;
          }
          p5.stroke(200, 50, 0, 150);
          p5.strokeWeight(3);
          p5.rect(0, -40, 80, 30);
          p5.noStroke();
          p5.rect(0, -40, sellTime, 30);
          p5.fill(255);
          p5.textAlign(p5.CENTER, p5.CENTER);
          p5.textFont('Oxanium', 15);
          p5.text('Sell (hold)', 0, -40);
        }
        p5.imageMode(p5.CENTER);
        p5.translate(0,-5);
        switch (tower.TowerType) {
          case TowerType.Basic:
            if (tower.level == 0) {
              p5.image(textures.get(Texture.Tower_Basic_Base_0), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Barrel_0), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Turret_0), 0, -10, 75, 75/2); 
            } else if (tower.level == 1) {
              p5.image(textures.get(Texture.Tower_Basic_Base_1), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Barrel_1), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Turret_1), 0, -10, 75, 75/2); 
            } else if (tower.level == 2) {
              p5.image(textures.get(Texture.Tower_Basic_Base_2), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Barrel_2), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Turret_2), 0, -10, 75, 75/2); 
            } else if (tower.level <= 3) {
              p5.image(textures.get(Texture.Tower_Basic_Base_3), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Barrel_3), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Basic_Turret_3), 0, -10, 75, 75/2); 
            }
            break;
          case TowerType.Machine:
            if (tower.level == 0) {
              p5.image(textures.get(Texture.Tower_Machine_Base_0), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Barrel_0), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Turret_0), 0, -10, 75, 75/2); 
            } else if (tower.level == 1) {
              p5.image(textures.get(Texture.Tower_Machine_Base_1), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Barrel_1), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Turret_1), 0, -10, 75, 75/2); 
            } else if (tower.level == 2) {
              p5.image(textures.get(Texture.Tower_Machine_Base_2), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Barrel_2), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Turret_2), 0, -10, 75, 75/2); 
            } else if (tower.level <= 3) {
              p5.image(textures.get(Texture.Tower_Machine_Base_3), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Barrel_3), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_Machine_Turret_3), 0, -10, 75, 75/2); 
            }
            break;
          case TowerType.RailGun:
            if (tower.level == 0) {
              p5.image(textures.get(Texture.Tower_RailGun_Base_0), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Barrel_0), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Turret_0), 0, -10, 75, 75/2); 
            } else if (tower.level == 1) {
              p5.image(textures.get(Texture.Tower_RailGun_Base_1), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Barrel_1), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Turret_1), 0, -10, 75, 75/2); 
            } else if (tower.level == 2) {
              p5.image(textures.get(Texture.Tower_RailGun_Base_2), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Barrel_2), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Turret_2), 0, -10, 75, 75/2); 
            } else if (tower.level <= 3) {
              p5.image(textures.get(Texture.Tower_RailGun_Base_3), 0, 10, 75-10, 75/2);
              p5.rotate(tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Barrel_3), 35, 0, 80, 75/8);
              p5.rotate(-tower.Direction);
              p5.image(textures.get(Texture.Tower_RailGun_Turret_3), 0, -10, 75, 75/2); 
            }
            break;
        }
        p5.pop();
      };

      if (world.towerMouse) {
        world.towerMouse.Position = new Vector(p5.mouseX, p5.mouseY)
          .sub(viewPort.x, viewPort.y)
          .mulScalar(1/viewPort.z)
        ;
        p5.translate(world.towerMouse.Position.x, world.towerMouse.Position.y);
        drawTower(world.towerMouse, true);
        p5.translate(-world.towerMouse.Position.x, -world.towerMouse.Position.y);
        // TODO: Verify placement
      }
      for (const tower of world.towers.values()) {
        p5.translate(tower.Position.x, tower.Position.y);
        let overTower = p5.dist(tower.Position.x,tower.Position.y,Mouse.x,Mouse.y) < 50;
        drawTower(tower, overTower, overTower);
        p5.translate(-tower.Position.x, -tower.Position.y);
      }
      p5.pop();
      p5.push();

      p5.translate(viewPort.x, viewPort.y);
      p5.scale(viewPort.z);

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
            p5.translate(100,(-p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(125,(-p5.cos(p5.frameCount * pa) * 10) + 175);
            p5.scale(-p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(150,(-p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_5), 0, 0);
            p5.push();
            p5.translate(100,(p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(125,(p5.cos(p5.frameCount * pa) * 10) + 175);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(150,(p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            break;
          case EnemyType.Scorpion2:
            p5.push();
            p5.translate(100,(-p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(125,(-p5.cos(p5.frameCount * pa) * 10) + 175);
            p5.scale(-p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(150,(-p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(-p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.image(textures.get(Texture.Enemy_Main_6), 0, 0);
            p5.image(textures.get(Texture.Enemy_Gun_6), 0, 0);
            p5.push();
            p5.translate(100,(p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(125,(p5.cos(p5.frameCount * pa) * 10) + 175);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            p5.push();
            p5.translate(150,(p5.sin(p5.frameCount * pa) * 10) + 175);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
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
            p5.image(textures.get(Texture.Enemy_Main_9), 0, 0);
            p5.image(textures.get(Texture.Enemy_Gun_9), 0, 0);
            
            p5.push();
            p5.translate(100,-p5.sin(p5.frameCount * pa) * 10 + 175);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            
            p5.push();
            p5.translate(50,-p5.cos(p5.frameCount * pa) * 10 + 175);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,1);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            
            p5.push();
            p5.translate(170,-p5.sin(p5.frameCount * pa) * 10 + 200);
            p5.scale(p5.sin(p5.frameCount * 2 * pa) * 0.5,0.75);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
            p5.pop();
            
            p5.push();
            p5.translate(220,-p5.cos(p5.frameCount * pa) * 10 + 200);
            p5.scale(p5.cos(p5.frameCount * 2 * pa) * 0.5,0.75);
            p5.image(textures.get(Texture.Enemy_Insect_Leg), -25, 0);
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
            p5.image(textures.get(Texture.Enemy_Main_12), 0,0);
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
        p5.rect(10, -20, 380, 20);
        p5.fill(70, 179, 115);
        p5.rect(10, -20, 380 * (enemy.health/enemy.maxHealth), 20);
        p5.pop();
      }

      for (const particle of worldContents.particles.values()) {
        p5.push();
        p5.translate(particle.Position.x, particle.Position.y);
        switch (particle.ParticleType){
          case ParticleType.Fire:
            p5.noStroke();
            p5.rectMode(p5.CENTER);
            p5.fill(255, 225, 0, particle.Opacity);
            p5.rect(0,0,particle.size,particle.size);
            break;
          case ParticleType.Smoke:
            p5.noStroke();
            p5.rectMode(p5.CENTER);
            p5.fill(100,100,100, particle.Opacity);
            p5.rect(0,0,particle.size,particle.size);
            break;
          case ParticleType.Bullet:
            p5.stroke(0,225,255, particle.Opacity);
            p5.strokeWeight(7 * particle.size/particle.len);
            p5.line(p5.cos(particle.rot) * (particle.len - particle.size), p5.sin(particle.rot) * (particle.len - particle.size), p5.cos(particle.rot) * particle.len, p5.sin(particle.rot) * particle.len);
            p5.stroke(255,255,255, particle.Opacity);
            p5.strokeWeight(3 * particle.size/particle.len);
            p5.line(p5.cos(particle.rot) * (particle.len - particle.size), p5.sin(particle.rot) * (particle.len - particle.size), p5.cos(particle.rot) * particle.len, p5.sin(particle.rot) * particle.len);
            break;
          case ParticleType.MgunBullet:
            p5.stroke(0,255, 150, particle.Opacity);
            p5.strokeWeight(7 * particle.size/particle.len);
            p5.line(p5.cos(particle.rot) * (particle.len - particle.size), p5.sin(particle.rot) * (particle.len - particle.size), p5.cos(particle.rot) * particle.len, p5.sin(particle.rot) * particle.len);
            p5.stroke(255,255,255, particle.Opacity);
            p5.strokeWeight(3 * particle.size/particle.len);
            p5.line(p5.cos(particle.rot) * (particle.len - particle.size), p5.sin(particle.rot) * (particle.len - particle.size), p5.cos(particle.rot) * particle.len, p5.sin(particle.rot) * particle.len);
            break;
          case ParticleType.RailgunBullet:
            p5.stroke(255,225,0, particle.Opacity);
            p5.strokeWeight(7 * particle.size/particle.len);
            p5.line(p5.cos(particle.rot) * (particle.len - particle.size), p5.sin(particle.rot) * (particle.len - particle.size), p5.cos(particle.rot) * particle.len, p5.sin(particle.rot) * particle.len);
            p5.stroke(255,255,255, particle.Opacity);
            p5.strokeWeight(3 * particle.size/particle.len);
            p5.line(p5.cos(particle.rot) * (particle.len - particle.size), p5.sin(particle.rot) * (particle.len - particle.size), p5.cos(particle.rot) * particle.len, p5.sin(particle.rot) * particle.len);
            break;
        }
        p5.pop();
      }
      p5.pop();

      if(p5.frameCount % 25 === 0)
        fr = p5.frameRate().toFixed(0);
      p5.text(fr, 20, 20);

      moneyCounts.innerText = `${world.money}`;
      waveButton.disabled = world.activeWave || !msgBox.classList.contains('Hidden');
      if(world.waveEnded && !world.activeWave) {
        if(world.waveCount > 0){
          audio.effect('nextwave.mp3', 0.5);
        }
        updateStore();
        setMessage();
        world.unend();
      }

      if (world.baseHealth <= 0 && !world.gameOver) {
        // Set Game Over
        world.paused = true;
        world.gameOver = true;
        // Send score to lb
        await fetch('/api/highscore', {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
          method: 'POST',
          body: JSON.stringify({ 
            score: world.waveCount, 
            generations: world.worldGenerator.generations,
            segmentLength: world.WorldSegmentList.length
          })
        });
        // Show Game Over popup
        document.getElementById('gameover')?.classList.remove('Hidden');
        const btns = document.querySelectorAll('button');
        btns.forEach(btn => {
           if (btn.id != 'HomeBtn4') 
            btn.disabled = true;
        });
      }
      // Money
      if (localMoney != world.money) {
        updateStore();
      }
      //arrow movements here
      if(p5.keyIsDown(p5.UP_ARROW)) viewPort.y += 10;
      if(p5.keyIsDown(p5.DOWN_ARROW)) viewPort.y -= 10;
      if(p5.keyIsDown(p5.LEFT_ARROW)) viewPort.x += 10;
      if(p5.keyIsDown(p5.RIGHT_ARROW)) viewPort.x -= 10;
    };
    
    p5.keyReleased = function keyReleased() {
      if (world.paused) return;
      if(p5.keyCode === 32) {
        if (msgBox.classList.contains('Hidden')) {
          world.newWave();
          waveCount.innerText = `${world.waveCount}`;
          activemessageIndex = 0;
        }else{
          audio.clickEffect();
          activemessageIndex++;
          setMessage();
        }
      }
      if(p5.keyCode === 27) {
        world.towerMouse = null;
      } 
      if(p5.keyCode === 187) {
        const diffX = p5.width/2 - viewPort.x;
        const diffY = p5.height/2 - viewPort.y;
        const scaleValue = 1.1;
        const dxScaled = diffX * scaleValue;
        const dyScaled = diffY * scaleValue;
        viewPort.z *= scaleValue;
        viewPort.y -= (dyScaled - diffY);
        viewPort.x -= (dxScaled - diffX);
      }
      if(p5.keyCode === 189) {
        const diffX = p5.width/2 - viewPort.x;
        const diffY = p5.height/2 - viewPort.y;
        const scaleValue = 0.9;
        const dxScaled = diffX * scaleValue;
        const dyScaled = diffY * scaleValue;
        viewPort.z *= scaleValue;
        viewPort.y -= (dyScaled - diffY);
        viewPort.x -= (dxScaled - diffX);
      }
      if (p5.keyCode == 27 && world.towerMouse != null)
        world.towerMouse = null;
        activeTowerPlacement = null;
      updateStore();
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
      ) return msgBox.classList.add('Hidden');
      const activeMessage = Dialog[world.waveCount][activemessageIndex];
      msgImage.src = `/src/assets/replers/${activeMessage.image}`;
      msgName.innerText = activeMessage.name;
      msgText.innerText = activeMessage.message;
      msgBox.classList.remove('Hidden');
    };
    waveButton.onclick = () => {
      updateStore();
      if (msgBox.classList.contains('Hidden')) {
        world.newWave();
        waveCount.innerText = `${world.waveCount}`;
        activemessageIndex = 0;
      }
    };
    advanceMessage.onclick = () => {
      activemessageIndex++;
      setMessage();
    };
    //setMessage();
    const updateStore = () => {
      const storeShelf = <HTMLElement>storeBody.querySelector('.tflex');
      storeShelf.innerHTML = '';
      const storeData = TowersShelf;
      for (const [ itemName, shelfItem ] of storeData.entries()) {
        // Build Html Element
        storeShelf.insertAdjacentHTML('beforeend', `
          <div class="topt opt ${world.money < (shelfItem.cost + (world.waveCount * 5)) ? 'Invalid' : ''}" itemtype="${itemName}">
            <div class="tname">${shelfItem.name} - $${shelfItem.cost + (world.waveCount * 5)}</div>
            <img src="/src/assets/${shelfItem.image}">
          </div>
        `);
      }
      for (const child of <HTMLElement[]>Array.from(storeShelf.children)) {
        child.onclick = () => {
          const item = Number(<string>child.getAttribute('itemtype'));
          const purchaseType = storeState == StoreState.Tower ? TowersShelf : SpecialsShelf;
          if (purchaseType.has(item)) {
            const purchase = <StoreItem>purchaseType.get(<number>item);
            // TODO: Show alert box and return rif you dont have enough money
            if (world.money < (purchase.cost + (world.waveCount * 5))) {
              audio.effect('error.mp3', 0.5);
            } else if (storeState == StoreState.Tower) {
              activeTowerPlacement = purchase;
              world.towerMouse = new Tower(purchase.cost, <TowerType>purchase?.type, new Vector(0, 0), 0, purchase.level ?? 0);
              updateStore();
            }
          }
        };
      }
    };
    updateStore();
    const toggleStore = (_storeState: StoreState) => {
      // Remove Event Listener
      storeState = storeState == _storeState ? StoreState.Closed : _storeState;
      storeBody.classList.toggle('Hidden', storeState == StoreState.Closed);
      storeButtonContainer.classList.toggle('up', !storeBody.classList.contains('Hidden'));
      // Add Store Elements
      updateStore();
    };
    towerStoreButton.onclick = () => toggleStore(StoreState.Tower);
    if (specialStoreButton != null) specialStoreButton.onclick = () => toggleStore(StoreState.Special);
    speedButton.onclick = () => {
      if (world.worldSpeedScalar == 1) {
        world.worldSpeedScalar = 0.5;
        speedButton.innerText = 'x2';
      } else {
        world.worldSpeedScalar = 1;
        speedButton.innerText = 'x1';
      }
    };
    document.addEventListener('visibilitychange', (event) => {
      if (document.hidden) {
        world.paused = true;
        pauseGame.innerText = '►';
        audio.pauseMusic();
        pauseOverlay.classList.remove('Hidden');
      }
    });
    pauseOverlay.onclick = () => {
      toggleGamePause();
    };
  }, gameScene ?? undefined);
};
const enum Button {
  Start,
  How,
  Credits,
  Home,
  Leaderboard
}
const menuButtonPressed = async (btn: Button) => {
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
    case Button.Leaderboard: {
      leaderboardScene.classList.remove('Hidden');
      // Populate LeaderBoard
      const _statsResponse = await fetch('/api/leaderboard');
      const _dataResponse = await fetch('/user-data');
      const container = <HTMLElement>document.querySelector('.lb > .lb-container');
      const profileBox = document.getElementById('profile-high');
      const profileName = document.getElementById('profile-name');
      try {
        container.innerHTML = '';
        const statsResponse = await _statsResponse.json();
        const dataResponse = await _dataResponse.json();
        statsResponse.sort((a: any[], b: any[]) => b[1] - a[1]).map(([ name, score ]: any[], i: number) => {
          // <div class="row"><span>1. JDOG787</span><span>1004</span>
          const row = document.createElement('div');
          const span1 = document.createElement('span');
          const span2 = document.createElement('span');
          span1.textContent = `${i + 1}. ${name}`;
          span2.textContent = `${score}`;
          row.appendChild(span1);
          row.appendChild(span2);
          row.classList.add('row');
          container.appendChild(row);
        });
        if (profileName)
          profileName.innerText = dataResponse.name;
        if (profileBox && dataResponse.score)
          profileBox.innerText = dataResponse.score ?? 0;
      } catch (err) {
        const row = document.createElement('div');
        const span1 = document.createElement('span');
        span1.textContent = 'Failed To Load Data';
        row.appendChild(span1);
        row.classList.add('row');
        container.appendChild(row);
      }
      break;
    }
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
homeButton_4.onclick = () => window.location.reload();
if(window.localStorage.getItem('seenmodal')) {
  loginModal.classList.add('Hidden');
  loginOverlay.classList.add('Hidden');
}
closeLogin.onclick = () => {
  loginModal.classList.add('Hidden');
  loginOverlay.classList.add('Hidden');
  localStorage.setItem('seenmodal', '1');
};
openLogin.onclick = () => {
  loginModal.classList.remove('Hidden');
  loginOverlay.classList.remove('Hidden');
  localStorage.setItem('seenmodal', '1');
};
authorizeReplit.onclick = () => {
  window.addEventListener('message', authComplete);
  const authWindow = window.open(`https://replit.com/auth_with_repl_site?domain=${location.host}`);
  function authComplete(e: any) {
    if (authWindow == null) return;
    if (e.data !== 'auth_complete') return;
    window.removeEventListener('message', authComplete);
    authWindow.close();
    window.localStorage.setItem('seenmodal', '1');
    location.reload();
  }
};
(async () => {
  const _dataResponse = await fetch('/user-data');
  const profileName = document.getElementById('profile-name');
  try {
    const dataResponse = await _dataResponse.json();
    if (profileName) {
      if (dataResponse) {
        profileName.innerText = dataResponse.name;
        usernameIndicator.innerText = dataResponse.name;
        loggedInIndicator.classList.remove('Hidden');
        openLogin.classList.add('Hidden');
      } else {
        profileName.innerText = 'Anonymous';
        usernameIndicator.innerText = 'Anonymous';
      } 
    }
  } catch (err) {
    usernameIndicator.innerText = 'Failed To Fetch User';
  }
})();
// Button effect
document.querySelectorAll('button').forEach((elm) => {
  elm.addEventListener('click', () => audio.clickEffect());
});