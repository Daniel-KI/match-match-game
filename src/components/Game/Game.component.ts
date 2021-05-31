import './Game.style.css';
import UI from '../../utils/UI.util';
import AudioController from '../../utils/AudioController.util';
import Card from '../Card/Card.component';
import Stopwatch from '../Stopwatch/Stopwatch.component';
import Modal from '../Modal/Modal.component';
import GamePhase from '../../enums/GamePhase.enum';
import Database from '../../utils/Database.util';

import { LevelModel, ThemeModel, CardModel } from '../../models/GameData.model';
import { ScoreModel, databaseName, recordsTableName } from '../../models/UserData.model';

import { levels } from '../../data/levels.data';
import { themes } from '../../data/themes.data';

export default class Game {
  private _rootNode: HTMLElement;

  private _audioController: AudioController;

  private _level: LevelModel;

  private _theme: ThemeModel;

  private _phase: GamePhase;

  private _stopwatch: Stopwatch;

  private _cards: Card[];

  private _cardToMatch: Card;

  private _matchedCards: Card[];

  private _matches: number;

  private _wrongMatches: number;

  private _htmlElement: HTMLElement;

  private _gameFieldHtmlElement: HTMLElement;

  private _startBtn: HTMLElement;

  private _pauseBtn: HTMLElement;

  constructor(level: LevelModel = levels.easy, theme: ThemeModel = themes.space) {
    this._audioController = new AudioController();
    this._level = level;
    this._theme = theme;
    this._phase = GamePhase.Stop;
    this._cards = [];
    this._matchedCards = [];
    this._matches = 0;
    this._wrongMatches = 0;
  }

  get rootNode(): HTMLElement {
    return this._rootNode;
  }

  set rootNode(newRootNode: HTMLElement) {
    this._rootNode = newRootNode;
  }

  get audioController(): AudioController {
    return this._audioController;
  }

  set audioController(newAudioController: AudioController) {
    this._audioController = newAudioController;
  }

  get level(): LevelModel {
    return this._level;
  }

  set level(newLevel: LevelModel) {
    this._level = newLevel;
  }

  get theme(): ThemeModel {
    return this._theme;
  }

  set theme(newTheme: ThemeModel) {
    this._theme = newTheme;
  }

  get phase(): GamePhase {
    return this._phase;
  }

  set phase(newPhase: GamePhase) {
    this._phase = newPhase;
  }

  get stopwatch(): Stopwatch {
    return this._stopwatch;
  }

  set stopwatch(newStopwatch: Stopwatch) {
    this._stopwatch = newStopwatch;
  }

  get cards(): Card[] {
    return this._cards;
  }

  set cards(newCards: Card[]) {
    this._cards = newCards;
  }

  get cardToMatch(): Card {
    return this._cardToMatch;
  }

  set cardToMatch(newCardToMatch: Card) {
    this._cardToMatch = newCardToMatch;
  }

  get matchedCards(): Card[] {
    return this._matchedCards;
  }

  set matchedCards(newMatchedCards: Card[]) {
    this._matchedCards = newMatchedCards;
  }

  get matches(): number {
    return this._matches;
  }

  set matches(newMatches: number) {
    this._matches = newMatches;
  }

  get wrongMatches(): number {
    return this._wrongMatches;
  }

  set wrongMatches(newWrongMatches: number) {
    this._wrongMatches = newWrongMatches;
  }

  get htmlElement(): HTMLElement {
    return this._htmlElement;
  }

  set htmlElement(newHtmlElement: HTMLElement) {
    this._htmlElement = newHtmlElement;
  }

  get gameFieldHtmlElement(): HTMLElement {
    return this._gameFieldHtmlElement;
  }

  set gameFieldHtmlElement(newGameFieldHtmlElement: HTMLElement) {
    this._gameFieldHtmlElement = newGameFieldHtmlElement;
  }

  get startBtn(): HTMLElement {
    return this._startBtn;
  }

  set startBtn(newStartBtn: HTMLElement) {
    this._startBtn = newStartBtn;
  }

  get pauseBtn(): HTMLElement {
    return this._pauseBtn;
  }

  set pauseBtn(newPauseBtn: HTMLElement) {
    this._pauseBtn = newPauseBtn;
  }

  static chooseLevel(): LevelModel {
    const levelName = localStorage.getItem('level');
    if (levelName === 'medium') {
      return levels.medium;
    }
    if (levelName === 'hard') {
      return levels.hard;
    }
    return levels.easy;
  }

  static chooseTheme(): ThemeModel {
    const themeName = localStorage.getItem('theme');
    if (themeName === 'heroes') {
      return themes.heroes;
    }
    if (themeName === 'tech') {
      return themes.tech;
    }
    return themes.space;
  }

  isPlaying(): boolean {
    return this.phase === GamePhase.Demonstrate || this.phase === GamePhase.Play || this.phase === GamePhase.Pause;
  }

  checkCards(card: Card): void {
    if (!this.cardToMatch) {
      this.cardToMatch = card;
    } else {
      this.matches++;
      const isMatched = this.cardToMatch.matchPair(card);
      if (!isMatched) {
        this.wrongMatches++;
      }
      if (isMatched) {
        this.matchedCards = this.matchedCards.concat([this.cardToMatch, card]);
        if (this.matchedCards.length === this.cards.length) {
          this.finishGame();
          return;
        }
      }
      this.cardToMatch = undefined;
    }
  }

  createRandomCardPair(): Card[] {
    const min = 0;
    const max: number = this.theme.cards.length - 1;
    const randNumber: number = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    const data: CardModel = this.theme.cards[randNumber];
    const isCardExist: boolean = this.cards.find((card) => card.name === data.name) !== undefined;
    if (isCardExist) {
      return this.createRandomCardPair();
    }
    const card1: Card = new Card(data);
    const card2: Card = new Card(data);
    return [card1, card2];
  }

  shuffleCardDeck(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const elementNumber: number = Math.floor(Math.random() * (i + 1));
      const tempElement: Card = this.cards[i];
      this.cards[i] = this.cards[elementNumber];
      this.cards[elementNumber] = tempElement;
    }
  }

  async showCards(): Promise<void> {
    this.phase = GamePhase.Demonstrate;
    this.audioController.tickingSoundPlay();
    await Card.demonstrateDeck(this.cards, this.level.cardPairs * 2 * 1000);
    this.audioController.tickingSoundStop();
  }

  async startGame(): Promise<void> {
    if (this.phase === GamePhase.Finished) {
      await this.resetGame();
      this.renderGameField();
    }
    await this.showCards();
    if (this.phase !== GamePhase.Stop) {
      this.phase = GamePhase.Play;
      this.stopwatch.start();
      this.audioController.bgMusicPlay();
      this.gameFieldHtmlElement.classList.remove('game__field_disable');
    }
  }

  pauseGame(): void {
    if (this.phase === GamePhase.Play) {
      this.phase = GamePhase.Pause;
      this.stopwatch.pause();
      this.audioController.bgMusicStop();
      this.audioController.waitingSoundPlay();
      this.gameFieldHtmlElement.classList.add('game__field_disable');
      this.pauseBtn.innerHTML = 'Resume';
    }
  }

  resumeGame(): void {
    if (this.phase === GamePhase.Pause) {
      this.phase = GamePhase.Play;
      this.stopwatch.start();
      this.audioController.waitingSoundStop();
      this.audioController.bgMusicPlay();
      this.gameFieldHtmlElement.classList.remove('game__field_disable');
      this.pauseBtn.innerHTML = 'Pause';
    }
  }

  async resetGame(): Promise<void> {
    this.phase = GamePhase.Stop;
    this.audioController.stopAll();
    this.stopwatch.stop();
    this._cards = [];
    this._matchedCards = [];
    this._cardToMatch = undefined;
    this._matches = 0;
    this._wrongMatches = 0;
    this.pauseBtn.innerHTML = 'Pause';
  }

  async gameResult(): Promise<void> {
    let result: number = (this.matches - this.wrongMatches) * 100 - (this.stopwatch.value / 1000) * 10;
    if (result < 0) result = 0;
    const currentUserId: string = localStorage.getItem('userId');
    const database: Database = new Database(databaseName);
    const record: ScoreModel = { points: result };
    await database.set(currentUserId, record, recordsTableName);
    const modalTitle = 'You win !!!';
    const modalMessage = `Your result is: ${result}`;
    const modal: Modal = new Modal(modalTitle, modalMessage);
    await modal.createAlert();
  }

  finishGame(): void {
    this.phase = GamePhase.Finished;
    this.stopwatch.pause();
    this.audioController.stopAll();
    this.audioController.finishSoundPlay();
    this.gameResult();
  }

  renderCards(): void {
    for (let i = 0; i < this.level.cardPairs; i++) {
      this.cards = this.cards.concat(this.createRandomCardPair());
    }
    this.shuffleCardDeck();
    this.cards.forEach((card) => {
      card.render(this.gameFieldHtmlElement);
      card.htmlElement.addEventListener('click', () => {
        this.checkCards(card);
      });
    });
  }

  renderGameField(): void {
    if (this.gameFieldHtmlElement) {
      this.gameFieldHtmlElement.remove();
    }
    this.gameFieldHtmlElement = UI.renderElement(
      this.htmlElement,
      'div',
      null,
      ['class', 'game__field game__field_disable'],
      ['id', 'game__field']
    );
    if (this.level === levels.easy) {
      this.gameFieldHtmlElement.classList.add('game__field_small');
    }
    if (this.level === levels.medium) {
      this.gameFieldHtmlElement.classList.add('game__field_medium');
    }
    if (this.level === levels.hard) {
      this.gameFieldHtmlElement.classList.add('game__field_big');
    }
    this.renderCards();
  }

  setStartBtnAction(): void {
    this.startBtn.addEventListener('click', async () => {
      this.audioController.btnSoundPlay();
      if (this.phase !== GamePhase.Demonstrate) {
        if (this.phase === GamePhase.Play || this.phase === GamePhase.Pause) {
          const modalTitle = 'You want to stop the game?';
          const modalMessage = 'Your previous progress will be reset...';
          const modal: Modal = new Modal(modalTitle, modalMessage);
          const answer: boolean = await modal.createConfirm();
          if (answer) {
            this.phase = GamePhase.Finished;
          }
        }
        await this.startGame();
      }
    });
  }

  setPauseBtnAction(): void {
    this.pauseBtn.addEventListener('click', () => {
      this.audioController.btnSoundPlay();
      if (this.phase === GamePhase.Play) {
        this.pauseGame();
      } else if (this.phase === GamePhase.Pause) {
        this.resumeGame();
      }
    });
  }

  renderGameController(): void {
    const gameController: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, ['class', 'game__controller']);
    this.startBtn = UI.renderElement(
      gameController,
      'button',
      'Start new game',
      ['class', 'game__btn'],
      ['id', 'game__btn_start']
    );
    this.pauseBtn = UI.renderElement(
      gameController,
      'button',
      'Pause',
      ['class', 'game__btn'],
      ['id', 'game__btn_pause']
    );
    this.setStartBtnAction();
    this.setPauseBtnAction();
  }

  render(rootNode: HTMLElement): void {
    this.level = Game.chooseLevel();
    this.theme = Game.chooseTheme();
    this.rootNode = rootNode;
    this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'game']);
    this.stopwatch = new Stopwatch();
    this.stopwatch.render(this.htmlElement);
    this.renderGameController();
    this.resetGame();
    this.renderGameField();
  }
}
