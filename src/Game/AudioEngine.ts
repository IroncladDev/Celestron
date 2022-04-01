import {Howl, Howler} from 'howler';

export default class AudioEngine {
  private musicTracks: string[] = [
    'song1', 'song2', 'song3', 'song4', 'song5', 'song6', 'song7', 'song8', 'song9'
  ];
  private effectInstances: number = 0;
  private prevSong: {name: string, id: number, song?: Howl} | null = null;
  private pickSong(): string {
    return this.musicTracks[Math.floor(Math.random()*this.musicTracks.length)];
  }
  private loadSong() {
    //@ts-ignore
    Howler.stop(this.prevSong?.id)
    let next = this.pickSong();
    while (next == this.prevSong?.name) {
      next = this.pickSong();
    }
    const song = this.song(next, 0.1);
    const id = song.play();
    this.prevSong = {
      name: next,
      id,
      song
    };
  }
  private song(songName: string, vol: number) {
    return new Howl({
      src: [`src/assets/sound/music/${songName}.mp3`],
      volume: vol
    });
  }
  public effect(effectName: string, vol: number) {
    if (this.effectInstances > 3) return; 
    this.effectInstances++;
    const effect = new Howl({
      src: [`src/assets/sound/effects/${effectName}`],
      volume: vol
    });
    effect.play();
    effect.on('end', () => this.effectInstances--);
    return effect;
  }
  public startMenuMusic() {
    const id = this.song('menu', 0.1).play();
    this.prevSong = {
      name: "menu",
      id
    };
  }
  public startGameMusic() {
    this.loadSong();
    // When Song Ends Play Next Song
    if (this.prevSong && this.prevSong.song != null) {
      this.prevSong.song.on('end', () => {
        this.loadSong();
      });
    }
  }

  public pauseMusic() {
    if (this.prevSong && this.prevSong.song != null)
      this.prevSong.song.pause();
  }
  public resumeMusic() {
    if (this.prevSong && this.prevSong.song != null)
      this.prevSong.song.play();
  }
  public clickEffect() {
    this.effect('click.wav', 1);
  }
}