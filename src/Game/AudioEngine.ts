import {Howl, Howler} from 'howler';

export default class AudioEngine {
  private musicTracks: string[] = [
    'song1', 'song2', 'song3', 'song4', 'song5', 'song6', 'song7', 'song8'
  ];
  private prevSong: {name: string, id: number, song: any} | null = null;

  private pickSong(): string {
    return this.musicTracks[Math.floor(Math.random()*this.musicTracks.length)];
  }

  private loadSong() {
    Howler.stop(this.prevSong?.id)
    let next = this.pickSong();
    while (next == this.prevSong.name) {
      next = this.pickSong();
    }
    const song = this.song(next, 0.1);
    const id = song.play();
    this.prevSong = {
      name: next,
      id,
      song
    }
  }

  private song(songName, vol) {
    return new Howl({
      src: [`src/assets/sound/music/${songName}.mp3`],
      volume: vol
    });
  }

  private effect(effectName, vol) {
    return new Howl({
      src: [`src/assets/sound/effects/${effectName}.wav`],
      volume: vol
    })
  }
  
  public startMenuMusic() {
    const id = this.song("menu", 0.1).play();
    this.prevSong = {
      name: "menu",
      id
    }
  }

  public startGameMusic() {
    this.loadSong();
    // When Song End Play Next Song
    this.prevSong?.song.on("end", () => {
      this.loadSong()
    })
  }

  public pauseMusic() {
    this.prevSong.song.pause()
  }

  public resumeMusic() {
    this.prevSong.song.play()

  }

  public clickEffect() {
    this.effect("click", 1).play();
  }
}