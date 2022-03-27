// Import Scss
import './style.scss';
// Import External Libs
import P5 from 'p5';
// Import Interal Libs
import Vector from './Game/Vector'; 
import World from './Game/World';
import AudioEngine from './Game/AudioEngine';
import { Dialog, Specials, Towers } from './Game/Data';
import { BackgroundType, EnemyType } from './Game/Types';
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
  PathBase
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
      // Load Images
      textures.set(Texture.Base, p5.loadImage('./src/assets/base.png'));
      textures.set(Texture.PathBase, p5.loadImage('./src/assets/misc/path-base.png'));
      textures.set(
        Texture.PathStraight, 
        p5.loadImage('./src/assets/misc/path-straight.png')
      );
      textures.set(
        Texture.PathTurn,
        p5.loadImage('./src/assets/misc/path-corner.png')
      );
      textures.set(
        Texture.Path4Way,
        p5.loadImage('./src/assets/misc/path-cross.png')
      );
      // Load Sound
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
      if(touches)
        touchStart.set(touches[0].pageX - viewPort.x, touches[0].pageY - viewPort.y);
    };
    p5.touchMoved = function mouseDragged(event: MouseEvent | TouchEvent) {
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
      // Perform World Update
      world.Update();
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
        p5.strokeWeight(1);
        p5.fill(125);
        p5.rect(segment.x, segment.y, segment.width, segment.height);
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
        for (const path of segment.paths) {
          p5.strokeWeight(10);
          p5.beginShape();
          p5.curveVertex(segment.x+path[0].x, segment.y+path[0].y);
          for (const point of path) {
            p5.curveVertex(segment.x+point.x, segment.y+point.y);
            p5.strokeWeight(20);
            p5.point(segment.x+point.x, segment.y+point.y);
            p5.strokeWeight(10);
          }
          p5.curveVertex(segment.x+path[path.length-1].x, segment.y+path[path.length-1].y);
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
        }
        // Draw Decorations
      }
      // Draw Enemies
      for (const enemy of worldContents.enemys) {
        switch (enemy.EnemyType) {
          case EnemyType.Test:
            p5.strokeWeight(10);
            p5.stroke(255, 0, 0);
            p5.point(enemy.Position.x, enemy.Position.y);
            break;
        }
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
    };
    // Add Buttons
    pauseGame.onclick = () => {
      audio.clickEffect();
      if (!world.paused) {
        pauseGame.innerText = '►';
        p5.noLoop();
        audio.pauseMusic();
      }
      else {
        pauseGame.innerText = '||';
        p5.loop();
        audio.resumeMusic();
      }
      pauseOverlay.classList.toggle('Hidden', world.paused);
      world.paused = !world.paused;
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
        msgBox.classList.remove('Hidden');
        activemessageIndex = 0;
        setMessage(); 
      }
    };
    advanceMessage.onclick = () => {
      activemessageIndex++;
      setMessage();
    };
    setMessage();
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
          console.log(`Purchase Type: ${item}, isTower? ${storeState}`)
        }
      }
    }
    towerStoreButton.onclick = () => toggleStore(StoreState.Tower);
    specialStoreButton.onclick = () => toggleStore(StoreState.Special);
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