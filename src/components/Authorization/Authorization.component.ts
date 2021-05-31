import './Authorization.style.css';
import UI from '../../utils/UI.util';
import AudioController from '../../utils/AudioController.util';
import Database from '../../utils/Database.util';
import { UserModel, databaseName, userTableName } from '../../models/UserData.model';
import { userImage } from '../../data/staticFiles.data';

export default class Authorization {
  private _rootNode: HTMLElement;

  private _htmlElement: HTMLElement;

  private _audioController: AudioController;

  private _submitBtn: HTMLElement;

  private _user: UserModel;

  private readonly _title: string = 'Sign in';

  private readonly _message: string = `Fill out your profile information, 
  and others will learn about your achievements!`;

  constructor() {
    this._audioController = new AudioController();
    this._rootNode = document.body;
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

  get submitBtn(): HTMLElement {
    return this._submitBtn;
  }

  set submitBtn(newSubmitBtn: HTMLElement) {
    this._submitBtn = newSubmitBtn;
  }

  get user(): UserModel {
    return this._user;
  }

  set user(newUser: UserModel) {
    this._user = newUser;
  }

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  static logout(): void {
    localStorage.removeItem('userId');
  }

  static getCurrentUserId(): string {
    return localStorage.getItem('userId');
  }

  static validateSpaces(strToCheck: string): boolean {
    const spacesRegex = /^\S(?!.*\s\s+).*?\S$/;
    return spacesRegex.test(strToCheck);
  }

  static removeExtraSpaces(stringToCheck: string): string {
    if (!Authorization.validateSpaces(stringToCheck)) {
      const isDuplicatedSpaces = /\s\s+/;
      return stringToCheck.trim().replace(isDuplicatedSpaces, '');
    }
    return stringToCheck;
  }

  static validateFullName(fullName: string): string {
    const isEmpty = fullName.length === 0;
    const justNumberOrSpaces = /^[\d\s]*$/.test(fullName);
    const noSymbolsExist = /^[^~!@#$%*()_\-\\+=|:;"'`<>,.\/?^]*$/.test(fullName);
    if (isEmpty) {
      return 'This field cannot be empty!';
    }
    if (justNumberOrSpaces) {
      return 'This field cannot consist only of numbers or spaces!';
    }
    if (!noSymbolsExist) {
      return 'This field cannot contain special characters!';
    }
    return '';
  }

  async saveUser(): Promise<void> {
    const userId = Database.generateHash(this.user.email.toLocaleLowerCase());
    const database: Database = new Database(databaseName);
    await database.set(userId, this.user, userTableName);
    localStorage.setItem('userId', userId);
  }

  static getAvatarData(avatarInput: HTMLInputElement): Promise<string | ArrayBuffer> {
    return new Promise((resolve) => {
      const imgFile: File = avatarInput.files[0];
      if (imgFile) {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(imgFile);
        reader.onloadend = () => {
          resolve(reader.result);
        };
      }
      if (!imgFile) {
        resolve(userImage);
      }
    });
  }

  setValidationStatus(): void {
    const inputs: NodeListOf<Element> = document.querySelectorAll('.login__input');
    let isAllValid = true;
    inputs.forEach((input) => {
      if (input.classList.contains('login__input_invalid')) {
        isAllValid = false;
      }
    });
    if (isAllValid) {
      this.submitBtn.classList.remove('login__btn_accept_disable');
    }
    if (!isAllValid) {
      this.submitBtn.classList.add('login__btn_accept_disable');
    }
  }

  static setValidInputStatus(input: HTMLInputElement): void {
    input.classList.add('login__input_valid');
    input.classList.remove('login__input_invalid');
  }

  static setInvalidInputStatus(input: HTMLInputElement): void {
    input.classList.add('login__input_invalid');
    input.classList.remove('login__input_valid');
  }

  setAvatarInputActions(avatarInput: HTMLInputElement, avatarPreviewImg: HTMLImageElement): void {
    avatarInput.addEventListener('invalid', () => {
      avatarInput.setCustomValidity('This field cannot be empty!');
      Authorization.setInvalidInputStatus(avatarInput);
      this.setValidationStatus();
    });
    avatarInput.addEventListener('change', async () => {
      const avatar: string | ArrayBuffer = await Authorization.getAvatarData(avatarInput);
      const isEmptyAvatar: boolean = avatar === userImage;

      if (avatar) {
        if (isEmptyAvatar) {
          avatarInput.setCustomValidity('This field cannot be empty!');
          avatarInput.reportValidity();
          Authorization.setInvalidInputStatus(avatarInput);
        }
        if (!isEmptyAvatar) {
          avatarInput.setCustomValidity('');
          Authorization.setValidInputStatus(avatarInput);
        }
        avatarPreviewImg.setAttribute('src', `${avatar}`);
        this.setValidationStatus();
      }
    });
  }

  setFullNameInputActions(fullNameInput: HTMLInputElement): void {
    const defaultMessage = 'This field cannot be empty!';
    let message: string = defaultMessage;

    fullNameInput.addEventListener('input', () => {
      const validateMessage: string = Authorization.validateFullName(fullNameInput.value);

      if (validateMessage) {
        message = validateMessage;
        fullNameInput.setCustomValidity(message);
        fullNameInput.reportValidity();
        Authorization.setInvalidInputStatus(fullNameInput);
      }
      if (!validateMessage) {
        message = defaultMessage;
        fullNameInput.setCustomValidity('');
        Authorization.setValidInputStatus(fullNameInput);
      }
      this.setValidationStatus();
    });
    fullNameInput.addEventListener('blur', () => {
      fullNameInput.value = Authorization.removeExtraSpaces(fullNameInput.value);
    });
    fullNameInput.addEventListener('invalid', () => {
      Authorization.setInvalidInputStatus(fullNameInput);
      fullNameInput.setCustomValidity(message);
      this.setValidationStatus();
    });
  }

  setEmailInputActions(emailInput: HTMLInputElement): void {
    const defaultMessage = 'Invalid email address!';
    let isValid = true;

    emailInput.addEventListener('input', () => {
      isValid = !emailInput.validity.typeMismatch;
      if (!isValid) {
        emailInput.setCustomValidity(defaultMessage);
        emailInput.reportValidity();
        Authorization.setInvalidInputStatus(emailInput);
      }
      if (isValid) {
        emailInput.setCustomValidity('');
        Authorization.setValidInputStatus(emailInput);
      }
      this.setValidationStatus();
    });
    emailInput.addEventListener('blur', () => {
      const cleanValue = Authorization.removeExtraSpaces(emailInput.value);
      emailInput.value = '';
      emailInput.value = cleanValue;
    });
    emailInput.addEventListener('invalid', () => {
      Authorization.setInvalidInputStatus(emailInput);
      emailInput.setCustomValidity(defaultMessage);
      this.setValidationStatus();
    });
  }

  render(): Promise<void> {
    return new Promise((resolve) => {
      this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'login']);

      const loginContainer: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, [
        'class',
        'login__container'
      ]);

      const loginHeader: HTMLElement = UI.renderElement(loginContainer, 'div', null, ['class', 'login__header']);
      UI.renderElement(loginHeader, 'h3', this.title, ['class', 'login__title']);

      const loginBody: HTMLElement = UI.renderElement(loginContainer, 'div', null, ['class', 'login__body']);
      UI.renderElement(loginBody, 'p', this.message, ['class', 'login__message']);

      const loginForm: HTMLElement = UI.renderElement(
        loginBody,
        'form',
        null,
        ['class', 'login__form'],
        ['id', 'login__form']
      );

      const loginAvatarBlock: HTMLElement = UI.renderElement(loginForm, 'div', null, ['class', 'login__user-avatar']);

      const loginLabelForAvatar: HTMLElement = UI.renderElement(
        loginAvatarBlock,
        'label',
        null,
        ['class', 'login__label_btn'],
        ['for', 'login__input_avatar'],
        ['title', 'Load avatar']
      );

      const loginAvatarInput: HTMLElement = UI.renderElement(
        loginLabelForAvatar,
        'input',
        null,
        ['class', 'login__input'],
        ['id', 'login__input_avatar'],
        ['type', 'file'],
        ['name', 'avatar'],
        ['accept', 'image/*'],
        ['required', '']
      );

      const loginAvatarImg: HTMLElement = UI.renderElement(
        loginLabelForAvatar,
        'img',
        null,
        ['class', 'login__avatar-img'],
        ['id', 'login__avatar-img'],
        ['src', userImage]
      );

      const loginUserInfoBlock: HTMLElement = UI.renderElement(loginForm, 'div', null, ['class', 'login__user-info']);

      const loginNameInput: HTMLElement = UI.renderElement(
        loginUserInfoBlock,
        'input',
        null,
        ['class', 'login__input'],
        ['type', 'text'],
        ['name', 'forename'],
        ['placeholder', 'name...'],
        ['maxlength', '30'],
        ['required', ''],
        ['autocomplete', 'on']
      );

      const loginSurnameInput: HTMLElement = UI.renderElement(
        loginUserInfoBlock,
        'input',
        null,
        ['class', 'login__input'],
        ['type', 'text'],
        ['name', 'surname'],
        ['placeholder', 'surname...'],
        ['maxlength', '30'],
        ['required', ''],
        ['autocomplete', 'on']
      );

      const loginEmailInput: HTMLElement = UI.renderElement(
        loginUserInfoBlock,
        'input',
        null,
        ['class', 'login__input'],
        ['type', 'email'],
        ['name', 'email'],
        ['placeholder', 'email...'],
        ['maxlength', '30'],
        ['required', ''],
        ['autocomplete', 'on']
      );

      this.setAvatarInputActions(loginAvatarInput as HTMLInputElement, loginAvatarImg as HTMLImageElement);
      this.setEmailInputActions(loginEmailInput as HTMLInputElement);
      this.setFullNameInputActions(loginNameInput as HTMLInputElement);
      this.setFullNameInputActions(loginSurnameInput as HTMLInputElement);

      const loginFooter: HTMLElement = UI.renderElement(loginContainer, 'div', null, ['class', 'login__footer']);
      const declineBtn: HTMLElement = UI.renderElement(loginFooter, 'button', 'Cancel', [
        'class',
        'login__btn login__btn_decline'
      ]);
      this.submitBtn = UI.renderElement(
        loginFooter,
        'button',
        'Submit',
        ['class', 'login__btn login__btn_accept'],
        ['type', 'submit'],
        ['form', 'login__form']
      );

      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form: HTMLFormElement = loginForm as HTMLFormElement;
        const name: string = Authorization.removeExtraSpaces(form.forename.value);
        const surname: string = Authorization.removeExtraSpaces(form.surname.value);
        const email: string = Authorization.removeExtraSpaces(form.email.value);
        const avatar: string | ArrayBuffer = await Authorization.getAvatarData(form.avatar);

        this.user = {
          avatar,
          name,
          surname,
          email
        };
        await this.saveUser();
        this.htmlElement.remove();
        resolve();
      });

      declineBtn.addEventListener('click', () => {
        this.audioController.btnSoundPlay();
        this.htmlElement.remove();
      });
      this.submitBtn.addEventListener('click', () => {
        this.audioController.btnSoundPlay();
      });
    });
  }
}
