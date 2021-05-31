import './Settings.style.css';
import UI from '../../utils/UI.util';
import AudioController from '../../utils/AudioController.util';
import Modal from '../Modal/Modal.component';
import { levels } from '../../data/levels.data';
import { themes } from '../../data/themes.data';

export default class Settings {
  private _rootNode: HTMLElement;

  private _htmlElement: HTMLElement;

  private _audioController: AudioController;

  private readonly _title: string = 'Settings';

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

  get title(): string {
    return this._title;
  }

  static async confirmChanges(optionName: string, value: string): Promise<boolean> {
    const modalTitle = `Are you sure you want to change game ${optionName}?`;
    const modalMessage = `New ${optionName} value is: ${value}`;
    const modal = new Modal(modalTitle, modalMessage);
    const answer: boolean = await modal.createConfirm();
    return answer;
  }

  static selectOption(optionElement: HTMLElement, optionTypeName: string): void {
    const selectedOption: HTMLElement = optionElement.parentElement.querySelector('.settings__option_selected');
    selectedOption.classList.remove('settings__option_selected');
    optionElement.classList.add('settings__option_selected');
    localStorage.setItem(optionTypeName, `${optionElement.getAttribute('data-name')}`);
  }

  renderOption(rootNode: HTMLElement, optionTypeName: string, name: string): void {
    const option: HTMLElement = UI.renderElement(
      rootNode,
      'div',
      null,
      ['class', 'settings__option'],
      ['data-name', `${name}`]
    );
    UI.renderElement(
      option,
      'input',
      null,
      ['class', 'settings__input'],
      ['type', 'radio'],
      ['id', `settings__input_${name.toLowerCase()}`]
    );
    const label: HTMLElement = UI.renderElement(
      option,
      'label',
      `${name}`,
      ['class', 'settings__label'],
      ['for', `settings__input_${name.toLowerCase()}`]
    );
    const selectedLevel = localStorage.getItem(optionTypeName);
    if (name === selectedLevel) {
      option.classList.add('settings__option_selected');
    }
    label.addEventListener('click', async () => {
      this.audioController.btnSoundPlay();
      const isConfirmed: boolean = await Settings.confirmChanges(optionTypeName, name);
      if (isConfirmed) Settings.selectOption(option, optionTypeName);
    });
  }

  render(rootNode: HTMLElement): void {
    this._rootNode = rootNode;
    this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'settings']);
    const settingsContainer: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, [
      'class',
      'settings__container'
    ]);
    UI.renderElement(settingsContainer, 'h2', this.title, ['class', 'settings__title']);
    const optionsContainer: HTMLElement = UI.renderElement(settingsContainer, 'div', null, [
      'class',
      'settings__options-container'
    ]);
    const level: HTMLElement = UI.renderElement(optionsContainer, 'div', null, ['class', 'settings__level']);
    UI.renderElement(level, 'h3', 'Level', ['class', 'settings__option-title']);
    const levelOptions: HTMLElement = UI.renderElement(level, 'div', null, ['class', 'settings__level-options']);
    const theme: HTMLElement = UI.renderElement(optionsContainer, 'div', null, ['class', 'settings__theme']);
    UI.renderElement(theme, 'div', 'Theme', ['class', 'settings__option-title']);
    const themeOptions: HTMLElement = UI.renderElement(theme, 'div', null, ['class', 'settings__theme-options']);

    Object.values(levels).forEach((levelData) => {
      const optionTypeName = 'level';
      this.renderOption(levelOptions, optionTypeName, levelData.name.toLowerCase());
    });
    Object.values(themes).forEach((themeData) => {
      const optionTypeName = 'theme';
      this.renderOption(themeOptions, optionTypeName, themeData.name.toLowerCase());
    });
  }
}
