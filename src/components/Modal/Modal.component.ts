import './Modal.style.css';
import UI from '../../utils/UI.util';
import AudioController from '../../utils/AudioController.util';

export default class Settings {
  private _audioController: AudioController;

  private _title: string;

  private _message: string;

  private _rootNode: HTMLElement;

  private _htmlElement: HTMLElement;

  private _response: boolean;

  constructor(title: string, message: string) {
    this._audioController = new AudioController();
    this._title = title;
    this._message = message;
    this._rootNode = document.body;
  }

  get audioController(): AudioController {
    return this._audioController;
  }

  set audioController(newAudioController: AudioController) {
    this._audioController = newAudioController;
  }

  get title(): string {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
  }

  get message(): string {
    return this._message;
  }

  set message(newMessage: string) {
    this._message = newMessage;
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

  get response(): boolean {
    return this._response;
  }

  set response(newResponse: boolean) {
    this._response = newResponse;
  }

  async createConfirm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'modal']);
      const modalContainer: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, [
        'class',
        'modal__container'
      ]);
      const modalHeader: HTMLElement = UI.renderElement(modalContainer, 'div', null, ['class', 'modal__header']);
      UI.renderElement(modalHeader, 'h3', `${this.title}`, ['class', 'modal__title']);
      const modalBody: HTMLElement = UI.renderElement(modalContainer, 'div', null, ['class', 'modal__body']);
      UI.renderElement(modalBody, 'p', `${this.message}`, ['class', 'modal__message']);
      const modalFooter: HTMLElement = UI.renderElement(modalContainer, 'div', null, ['class', 'modal__footer']);
      const declineBtn: HTMLElement = UI.renderElement(modalFooter, 'button', 'Cancel', [
        'class',
        'modal__btn modal__btn_decline'
      ]);
      const acceptBtn: HTMLElement = UI.renderElement(modalFooter, 'button', 'OK', [
        'class',
        'modal__btn modal__btn_accept'
      ]);
      acceptBtn.focus();
      declineBtn.addEventListener('click', () => {
        this.audioController.btnSoundPlay();
        this.htmlElement.remove();
        this.response = false;
        resolve(this.response);
      });
      acceptBtn.addEventListener('click', () => {
        this.audioController.btnSoundPlay();
        this.htmlElement.remove();
        this.response = true;
        resolve(this.response);
      });
    });
  }

  async createAlert(): Promise<void> {
    return new Promise((resolve) => {
      this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'modal']);
      const modalContainer: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, [
        'class',
        'modal__container'
      ]);
      const modalHeader: HTMLElement = UI.renderElement(modalContainer, 'div', null, ['class', 'modal__header']);
      UI.renderElement(modalHeader, 'h3', `${this.title}`, ['class', 'modal__title']);
      const modalBody: HTMLElement = UI.renderElement(modalContainer, 'div', null, ['class', 'modal__body']);
      UI.renderElement(modalBody, 'p', `${this.message}`, ['class', 'modal__message']);
      const modalFooter: HTMLElement = UI.renderElement(modalContainer, 'div', null, ['class', 'modal__footer']);
      const acceptBtn: HTMLElement = UI.renderElement(modalFooter, 'button', 'OK', [
        'class',
        'modal__btn modal__btn_accept'
      ]);
      acceptBtn.focus();
      acceptBtn.addEventListener('click', () => {
        this.audioController.btnSoundPlay();
        this.htmlElement.remove();
        resolve();
      });
    });
  }
}
