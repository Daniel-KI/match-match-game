import About from '../components/About/About.component';
import Game from '../components/Game/Game.component';
import Score from '../components/Score/Score.component';
import Settings from '../components/Settings/Settings.component';

const about = new About();
const game = new Game();
const score = new Score();
const settings = new Settings();

const routes = {
  about: {
    path: '/',
    view: about
  },
  score: {
    path: '/score',
    view: score
  },
  settings: {
    path: '/settings',
    view: settings
  },
  game: {
    path: '/game',
    view: game
  }
};

export { routes };
