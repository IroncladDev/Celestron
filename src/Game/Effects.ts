import {Howl} from 'howler'

export default class Effect {
  private effect(effectName, vol) {
    return new Howl({
      src: [`src/assets/sound/effects/${effectName}.wav`],
      volume: vol
    })
  }

  public clickEffect() {
    this.effect("click", 1).play();
  }
  
}