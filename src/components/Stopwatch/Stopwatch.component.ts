import UI from '../../utils/UI.util';
import './Stopwatch.style.css';
import StopwatchState from '../../enums/StopwatchState.enum';

export default class Stopwatch {
  private _state: StopwatchState;

  private _delay: number;

  private _interval: NodeJS.Timeout | undefined;

  private _value: number;

  private _rootNode: HTMLElement;

  private _htmlElement: HTMLElement;

  private _displayElement: HTMLElement;

  constructor(delay = 1000) {
    this.state = StopwatchState.Stop;
    this.delay = delay;
    this.value = 0;
  }

  get state(): StopwatchState {
    return this._state;
  }

  set state(newState: StopwatchState) {
    this._state = newState;
  }

  get delay(): number {
    return this._delay;
  }

  set delay(newDelay: number) {
    this._delay = newDelay;
  }

  get interval(): NodeJS.Timeout {
    return this._interval;
  }

  set interval(newInterval: NodeJS.Timeout) {
    this._interval = newInterval;
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    this._value = newValue;
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

  get displayElement(): HTMLElement {
    return this._displayElement;
  }

  set displayElement(newDisplayElement: HTMLElement) {
    this._displayElement = newDisplayElement;
  }

  static formatTime(ms: number): string {
    let hours: string | number = Math.floor(ms / 3600000);
    let minutes: string | number = Math.floor((ms - hours * 3600000) / 60000);
    let seconds: string | number = Math.floor((ms - hours * 3600000 - minutes * 60000) / 1000);
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  }

  update(): void {
    if (this.state === StopwatchState.Run) {
      this.value += this.delay;
    }
    this.displayElement.innerHTML = Stopwatch.formatTime(this.value);
  }

  start(): void {
    if (this.state === StopwatchState.Pause || this.state === StopwatchState.Stop) {
      this.state = StopwatchState.Run;
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.update();
        }, this.delay);
      }
    }
  }

  pauseUpdate(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  pause(): void {
    if (this.state === StopwatchState.Run) {
      this.state = StopwatchState.Pause;
      this.pauseUpdate();
    }
  }

  stop(): void {
    this.state = StopwatchState.Stop;
    this.value = 0;
    this.pauseUpdate();
    this.update();
  }

  render(rootNode: HTMLElement): void {
    this.rootNode = rootNode;
    this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'stopwatch'], ['id', 'stopwatch']);
    this.displayElement = UI.renderElement(this.htmlElement, 'p', '00:00:00', ['class', 'stopwatch__data']);
  }
}
