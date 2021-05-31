import './Card.style.css';
import UI from '../../utils/UI.util';
import AudioController from '../../utils/AudioController.util';
import CardState from '../../enums/CardState.enum';
import { cardBackImage } from '../../data/staticFiles.data';
import { CardModel } from '../../models/GameData.model';

export default class Card {
  private _rootNode: HTMLElement;

  private _audioController: AudioController;

  private _name: string;

  private _frontImage: string;

  private _backImage: string;

  private _cardState: CardState;

  private _htmlElement: HTMLElement;

  constructor(cardData: CardModel) {
    this._audioController = new AudioController();
    this._name = cardData.name;
    this._frontImage = cardData.image;
    this._backImage = cardBackImage;
    this._cardState = CardState.FaceDown;
  }

  public get rootNode(): HTMLElement {
    return this._rootNode;
  }

  public set rootNode(newRootNode: HTMLElement) {
    this._rootNode = newRootNode;
  }

  get audioController(): AudioController {
    return this._audioController;
  }

  set audioController(newAudioController: AudioController) {
    this._audioController = newAudioController;
  }

  public get name(): string {
    return this._name;
  }

  public set name(newName: string) {
    this._name = newName;
  }

  public get frontImage(): string {
    return this._frontImage;
  }

  public set frontImage(newFrontImage: string) {
    this._frontImage = newFrontImage;
  }

  public get backImage(): string {
    return this._backImage;
  }

  public set backImage(newBackImage: string) {
    this._backImage = newBackImage;
  }

  public get cardState(): CardState {
    return this._cardState;
  }

  public set cardState(newCardState: CardState) {
    this._cardState = newCardState;
  }

  public get htmlElement(): HTMLElement {
    return this._htmlElement;
  }

  public set htmlElement(newHtmlElement: HTMLElement) {
    this._htmlElement = newHtmlElement;
  }

  flip(): void {
    if (this.cardState === CardState.FaceUp) {
      this.cardState = CardState.FaceDown;
    }
    if (this.cardState === CardState.FaceDown) {
      this.cardState = CardState.FaceUp;
    }
    this.htmlElement.classList.toggle('card_flipped');
  }

  correctMatch(): void {
    this.htmlElement.classList.add('card_correct-match');
  }

  wrongMatch(): void {
    this.htmlElement.classList.add('card_wrong-match');
    setTimeout(() => {
      this.htmlElement.classList.remove('card_flipped');
      this.htmlElement.classList.remove('card_wrong-match');
    }, 2000);
    this.cardState = CardState.FaceDown;
  }

  matchPair(anotherCard: Card): boolean {
    const isMatching = this.name === anotherCard.name;
    if (isMatching) {
      this.audioController.correctMatchSoundPlay();
      this.correctMatch();
      anotherCard.correctMatch();
      return true;
    }
    this.audioController.wrongMatchSoundPlay();
    this.wrongMatch();
    anotherCard.wrongMatch();
    this.audioController.flipBackSoundPlay();
    return false;
  }

  static flipDeck(cards: Card[]): void {
    cards.forEach((card) => {
      card.flip();
    });
  }

  static demonstrateDeck(cards: Card[], duration: number): Promise<void> {
    setTimeout(() => {
      Card.flipDeck(cards);
    }, 1000);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Card.flipDeck(cards));
      }, duration);
    });
  }

  setFlipAction(): void {
    this.htmlElement.addEventListener('click', () => {
      this.flip();
    });
  }

  setFlipSound(): void {
    this.htmlElement.addEventListener('click', () => {
      if (this.cardState === CardState.FaceDown) {
        this.audioController.flipSoundPlay();
      }
      if (this.cardState === CardState.FaceUp) {
        this.audioController.flipBackSoundPlay();
      }
    });
  }

  render(rootNode: HTMLElement): void {
    this.rootNode = rootNode;
    this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'card'], ['name', this.name]);
    const cardBack: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, ['class', 'card__back']);
    UI.renderElement(cardBack, 'img', null, ['class', 'card__image_back'], ['src', this.backImage]);
    const cardFront: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, ['class', 'card__front']);
    UI.renderElement(cardFront, 'div', null, ['class', 'card__mask']);
    UI.renderElement(cardFront, 'img', null, ['class', 'card__image_front'], ['src', this.frontImage]);
    this.setFlipAction();
    this.setFlipSound();
  }
}
