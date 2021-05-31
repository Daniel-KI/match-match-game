import './About.style.css';
import UI from '../../utils/UI.util';
import AudioController from '../../utils/AudioController.util';
import Authorization from '../Authorization/Authorization.component';
import { backVideo } from '../../data/staticFiles.data';

export default class About {
  private _rootNode: HTMLElement;

  private _htmlElement: HTMLElement;

  private _audioController: AudioController;

  private readonly _title: string = 'Space cards';

  private readonly _rules: string = `All cards are mixed up.
  Cards lay down in rows, face down.
  You should turn over any two cards.
  If the two cards match, they will stay face up.
  If they don’t match, they will turn back over.
  The game is over when all the cards have been
  matched.`;

  private readonly _startText: string = "Let's start...";

  constructor() {
    this._audioController = new AudioController();
  }

  get rootNode(): HTMLElement {
    return this._rootNode;
  }

  set rootNode(newRootNode: HTMLElement) {
    this._rootNode = newRootNode;
  }

  get htmlElement(): HTMLElement {
    return this._htmlElement;
  }

  set htmlElement(newHtmlElement: HTMLElement) {
    this._htmlElement = newHtmlElement;
  }

  get audioController(): AudioController {
    return this._audioController;
  }

  set audioController(newAudioController: AudioController) {
    this._audioController = newAudioController;
  }

  get rules(): string {
    return this._rules;
  }

  get title(): string {
    return this._title;
  }

  get startText(): string {
    return this._startText;
  }

  static setStartBtnAction(startBtn: HTMLElement): void {
    startBtn.addEventListener('click', async () => {
      const userId: string = Authorization.getCurrentUserId();
      if (userId) {
        const startMenuBtn: HTMLElement = document.getElementById('nav__btn_start');
        startMenuBtn.click();
      }
      if (!userId) {
        const loginMenuBtn: HTMLElement = document.getElementById('nav__btn_login');
        loginMenuBtn.click();
      }
    });
  }

  render(rootNode: HTMLElement): void {
    this.rootNode = rootNode;
    this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'about']);
    const aboutVideo: HTMLElement = UI.renderElement(
      this.htmlElement,
      'video',
      null,
      ['class', 'about__video'],
      ['muted', ''],
      ['autoplay', ''],
      ['loop', '']
    );
    UI.renderElement(aboutVideo, 'source', null, ['src', `${backVideo}`], ['type', 'video/webm']);
    const video: HTMLVideoElement = aboutVideo as HTMLVideoElement;
    video.oncanplaythrough = () => {
      video.muted = true;
      video.play();
    };
    const aboutContainer: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, ['class', 'about__container']);
    UI.renderElement(aboutContainer, 'h2', null, ['class', 'about__info']);
    UI.renderElement(aboutContainer, 'h2', this.title, ['class', 'about__title']);
    UI.renderElement(aboutContainer, 'p', this.rules, ['class', 'about__rules']);
    const aboutBtn: HTMLElement = UI.renderElement(aboutContainer, 'button', this.startText, ['class', 'about__btn']);
    About.setStartBtnAction(aboutBtn);
  }
}
