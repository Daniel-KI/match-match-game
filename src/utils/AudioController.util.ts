const path = '../assets/sounds/';

export default class AudioController {
  private _btnSound;

  private _tickingSound;

  private _bgMusic;

  private _flipSound;

  private _flipBackSound;

  private _correctMatchSound;

  private _wrongMatchSound;

  private _waitingSound;

  private _finishSound;

  constructor() {
    this._btnSound = new Audio(`${path}button.mp3`);
    this._tickingSound = new Audio(`${path}ticking.mp3`);
    this._bgMusic = new Audio(`${path}bg-music.mp3`);
    this._flipSound = new Audio(`${path}flip.mp3`);
    this._flipBackSound = new Audio(`${path}flip-back.mp3`);
    this._correctMatchSound = new Audio(`${path}match-correct.mp3`);
    this._wrongMatchSound = new Audio(`${path}match-wrong.mp3`);
    this._waitingSound = new Audio(`${path}waiting.mp3`);
    this._finishSound = new Audio(`${path}finish.mp3`);
  }

  get btnSound(): HTMLAudioElement {
    return this._btnSound;
  }

  set btnSound(newBtnSound: HTMLAudioElement) {
    this._btnSound = newBtnSound;
  }

  get tickingSound(): HTMLAudioElement {
    return this._tickingSound;
  }

  set tickinkgSound(newTickingSound: HTMLAudioElement) {
    this._tickingSound = newTickingSound;
  }

  get bgMusic(): HTMLAudioElement {
    return this._bgMusic;
  }

  set bgMusic(newBgMusic: HTMLAudioElement) {
    this._bgMusic = newBgMusic;
  }

  get flipSound(): HTMLAudioElement {
    return this._flipSound;
  }

  set flipSound(newFlipSound: HTMLAudioElement) {
    this._flipSound = newFlipSound;
  }

  get flipBackSound(): HTMLAudioElement {
    return this._flipBackSound;
  }

  set flipBackSound(newFlipBackSound: HTMLAudioElement) {
    this._flipBackSound = newFlipBackSound;
  }

  get correctMatchSound(): HTMLAudioElement {
    return this._correctMatchSound;
  }

  set correctMatchSound(newCorrectMatchSound: HTMLAudioElement) {
    this._correctMatchSound = newCorrectMatchSound;
  }

  get wrongMatchSound(): HTMLAudioElement {
    return this._wrongMatchSound;
  }

  set wrongMatchSound(newWrongMatchSound: HTMLAudioElement) {
    this._wrongMatchSound = newWrongMatchSound;
  }

  get waitingSound(): HTMLAudioElement {
    return this._waitingSound;
  }

  set waitingSound(newWaitingSound: HTMLAudioElement) {
    this._waitingSound = newWaitingSound;
  }

  get finishSound(): HTMLAudioElement {
    return this._finishSound;
  }

  set finishSound(newFinishSound: HTMLAudioElement) {
    this._finishSound = newFinishSound;
  }

  tickingSoundPlay(): void {
    this.tickingSound.volume = 0.3;
    this.tickingSound.loop = true;
    this.tickingSound.play();
  }

  tickingSoundStop(): void {
    this.tickingSound.pause();
    this.tickingSound.currentTime = 0;
  }

  bgMusicPlay(): void {
    this.bgMusic.volume = 0.3;
    this.bgMusic.loop = true;
    this.bgMusic.play();
  }

  bgMusicStop(): void {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  waitingSoundPlay(): void {
    this.waitingSound.volume = 0.3;
    this.waitingSound.loop = true;
    this.waitingSound.play();
  }

  waitingSoundStop(): void {
    this.waitingSound.pause();
    this.waitingSound.currentTime = 0;
  }

  btnSoundPlay(): void {
    this.btnSound.play();
  }

  flipSoundPlay(): void {
    this.flipSound.play();
  }

  flipBackSoundPlay(): void {
    this.flipBackSound.play();
  }

  correctMatchSoundPlay(): void {
    this.correctMatchSound.play();
  }

  wrongMatchSoundPlay(): void {
    this.wrongMatchSound.play();
  }

  finishSoundPlay(): void {
    this.finishSound.play();
  }

  stopAll(): void {
    this.tickingSoundStop();
    this.bgMusicStop();
    this.waitingSoundStop();
  }
}
