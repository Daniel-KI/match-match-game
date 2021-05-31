import './Menu.style.css';
import UI from '../../utils/UI.util';
import AudioController from '../../utils/AudioController.util';
import Router from '../../utils/Router.util';
import Authorization from '../Authorization/Authorization.component';
import Modal from '../Modal/Modal.component';
import Database from '../../utils/Database.util';

import { routes } from '../../data/routes.data';
import { logoImage, menuImage } from '../../data/staticFiles.data';

import { UserModel, databaseName, userTableName } from '../../models/UserData.model';

export default class Menu {
  private _router: Router;

  private _rootNode: HTMLElement;

  private _audioController: AudioController;

  private _currentUser: UserModel;

  private readonly _title: string = 'Match-match game';

  constructor(router: Router) {
    this._router = router;
    this._audioController = new AudioController();
  }

  get router(): Router {
    return this._router;
  }

  set router(newRouter: Router) {
    this._router = newRouter;
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

  get currentUser(): UserModel {
    return this._currentUser;
  }

  set currentUser(newCurrentUser: UserModel) {
    this._currentUser = newCurrentUser;
  }

  get title(): string {
    return this._title;
  }

  static toggleMenu(): void {
    const menu: HTMLElement = document.getElementById('nav_top');
    menu.classList.toggle('nav_displayed');
  }

  static setToggleMenuAction(menuBtn: HTMLElement): void {
    menuBtn.addEventListener('click', () => {
      this.toggleMenu();
    });
  }

  async setMenuAppearance(actions: HTMLElement): Promise<void> {
    const currentUserId = Authorization.getCurrentUserId();
    if (currentUserId) {
      actions.innerHTML = '';
      const database: Database = new Database(databaseName);
      const userId: string = Authorization.getCurrentUserId();
      const user: { id: string; value: UserModel } = (await database.get(userId, userTableName)) as {
        id: string;
        value: UserModel;
      };

      const userAvatar: HTMLElement = UI.renderElement(
        actions,
        'img',
        null,
        ['class', 'nav__user-img'],
        ['alt', 'avatar'],
        ['src', `${user.value.avatar}`]
      );
      const startBtn: HTMLElement = UI.renderElement(
        actions,
        'button',
        'start',
        ['class', 'nav__btn'],
        ['id', 'nav__btn_start']
      );
      this.setLogoutAction(userAvatar);
      this.setStartAction(startBtn);
    }
    if (!currentUserId) {
      actions.innerHTML = '';
      const loginBtn: HTMLElement = UI.renderElement(
        actions,
        'button',
        'login',
        ['class', 'nav__btn'],
        ['id', 'nav__btn_login']
      );
      this.setLoginAction(loginBtn);
    }
  }

  setLogoutAction(element: HTMLElement): void {
    element.addEventListener('click', async () => {
      const modalTitle = 'Are you sure you want to change user?';
      const modalMessage = 'You can re-login later...';
      const modal: Modal = new Modal(modalTitle, modalMessage);
      const answer: boolean = await modal.createConfirm();
      if (answer) {
        Authorization.logout();
        this.setMenuAppearance(element.parentElement);
        this.router.updatePageByUrl('about', 'about', '/about');
      }
    });
  }

  setStartAction(element: HTMLElement): void {
    element.addEventListener('click', async () => {
      this.audioController.btnSoundPlay();
      this.router.updatePageByUrl('game', 'game', '/game');
      Menu.toggleMenu();
    });
  }

  setLoginAction(element: HTMLElement): void {
    element.addEventListener('click', async () => {
      this.audioController.btnSoundPlay();
      const auth = new Authorization();
      await auth.render();
      this.setMenuAppearance(element.parentElement);
    });
  }

  render(rootNode: HTMLElement): void {
    this.rootNode = rootNode;

    const header: HTMLElement = UI.renderElement(this.rootNode, 'header', null, ['class', 'header']);
    const headerContainer: HTMLElement = UI.renderElement(header, 'div', null, ['class', 'header__container']);

    const logoLink: HTMLElement = UI.renderElement(
      headerContainer,
      'a',
      null,
      ['class', 'header__logo'],
      ['href', '/']
    );
    logoLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.router.updatePageByUrl('about', 'about', logoLink.getAttribute('href'));
      Menu.toggleMenu();
    });
    UI.renderElement(logoLink, 'img', null, ['class', 'header__logo-img'], ['src', logoImage], ['alt', 'logo']);
    UI.renderElement(logoLink, 'h1', this.title, ['class', 'header__logo-title']);

    const menuBtn: HTMLElement = UI.renderElement(
      headerContainer,
      'img',
      null,
      ['class', 'nav__burger'],
      ['id', 'nav__burger'],
      ['src', menuImage],
      ['alt', 'menu']
    );

    const headerNav: HTMLElement = UI.renderElement(headerContainer, 'nav', null, ['class', 'nav'], ['id', 'nav_top']);
    const headerNavList: HTMLElement = UI.renderElement(headerNav, 'ul', null, ['class', 'nav__list']);

    const routeObjects = Object.entries(routes);
    routeObjects.forEach(([name, data]) => {
      if (name !== 'game') {
        const navItem: HTMLElement = UI.renderElement(headerNavList, 'li', null, ['class', 'nav__item']);
        const navItemLink: HTMLElement = UI.renderElement(
          navItem,
          'a',
          name,
          ['class', 'nav__link'],
          ['id', `nav__link-${name}`],
          ['href', `${data.path}`]
        );
        navItemLink.addEventListener('click', (event) => {
          event.preventDefault();
          this.router.updatePageByUrl(name, name, data.path);
          Menu.toggleMenu();
        });
      }
    });
    const actions: HTMLElement = UI.renderElement(
      headerNavList,
      'li',
      null,
      ['class', 'nav__item'],
      ['id', 'nav__item-actions']
    );

    Menu.setToggleMenuAction(menuBtn);
    this.setMenuAppearance(actions);
  }
}
