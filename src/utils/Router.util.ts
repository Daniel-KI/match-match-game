import UI from './UI.util';
import Menu from '../components/Menu/Menu.component';
import { routes } from '../data/routes.data';
import About from '../components/About/About.component';
import Game from '../components/Game/Game.component';
import Score from '../components/Score/Score.component';
import Settings from '../components/Settings/Settings.component';
import GamePhase from '../enums/GamePhase.enum';
import Modal from '../components/Modal/Modal.component';
import Authorization from '../components/Authorization/Authorization.component';

export default class Router {
  private static rootNode: HTMLElement = document.body;

  private static renderNode: HTMLElement = UI.renderElement(Router.rootNode, 'div', null, ['id', 'app__container']);

  private _currentUrl: Location;

  private _currentRoute: About | Game | Score | Settings;

  get currentUrl(): Location {
    return this._currentUrl;
  }

  set currentUrl(newUrl: Location) {
    this._currentUrl = newUrl;
  }

  get currentRoute(): About | Game | Score | Settings {
    return this._currentRoute;
  }

  set currentRoute(newRoute: About | Game | Score | Settings) {
    this._currentRoute = newRoute;
  }

  static setActiveRoute(name: string): void {
    const links: NodeListOf<Element> = document.querySelectorAll('.nav__link');
    links.forEach((link) => {
      link.classList.remove('nav__link_selected');
    });
    const newActiveLink: HTMLElement = document.getElementById(`nav__link-${name}`);
    if (newActiveLink) newActiveLink.classList.add('nav__link_selected');
  }

  callRender(path: string): void {
    const isAuthorized = !!Authorization.getCurrentUserId();
    Router.renderNode.innerHTML = '';
    if (this.currentRoute) {
      this.currentRoute.audioController.stopAll();
    }

    if (path) {
      this.currentRoute = routes.about.view;
      Router.setActiveRoute('about');
    }
    if (path === routes.score.path) {
      this.currentRoute = routes.score.view;
      Router.setActiveRoute('score');
    }
    if (path === routes.settings.path) {
      this.currentRoute = routes.settings.view;
      Router.setActiveRoute('settings');
    }
    if (path === routes.game.path) {
      if (isAuthorized) {
        this.currentRoute = routes.game.view;
        Router.setActiveRoute('game');
      }
      if (!isAuthorized) {
        this.updatePageByUrl('about', 'about', routes.about.path);
        return;
      }
    }
    this.currentRoute.render(Router.renderNode);
  }

  async updatePageByUrl(pageId: string, name: string, path: string): Promise<void> {
    const isExist = !!this.currentUrl;
    let isRepeated = false;
    if (isExist) {
      isRepeated = this.currentUrl.pathname === path;
    }
    if (!isRepeated) {
      if (this.currentRoute === routes.game.view) {
        const isActive: boolean = this.currentRoute.isPlaying();

        if (isActive) {
          const modalTitle = 'Do you want to leave this page?';
          const modalMessage = 'Your progress will be reset...';
          const modal: Modal = new Modal(modalTitle, modalMessage);
          const answer: boolean = await modal.createConfirm();
          if (!answer) {
            return;
          }
          this.currentRoute.phase = GamePhase.Stop;
        }
      }
      history.pushState({ pageId }, name, path);
      Router.setActiveRoute(name);
      this.callRender(path);
    }
  }

  updatePage(): void {
    const newPath: string = window.location.pathname;
    this.callRender(newPath);
  }

  loadPage(): void {
    const menu = new Menu(this);
    menu.render(Router.rootNode);
    this.currentUrl = window.location;
    const path: string = window.location.pathname;
    this.callRender(path);
  }

  listen(): void {
    window.addEventListener('load', () => {
      this.loadPage();
    });

    window.addEventListener('popstate', () => {
      this.updatePage();
    });
  }
}
