import './Score.style.css';
import UI from '../../utils/UI.util';
import Database from '../../utils/Database.util';
import AudioController from '../../utils/AudioController.util';
import { ScoreModel, databaseName, recordsTableName, UserModel, userTableName } from '../../models/UserData.model';

export default class Score {
  private _rootNode: HTMLElement;

  private _database: Database;

  private _htmlElement: HTMLElement;

  private _audioController: AudioController;

  private readonly _title: string = 'Best players';

  private readonly _emptyTableMessage: string = 'No records here';

  constructor() {
    this._audioController = new AudioController();
    this._database = new Database(databaseName);
  }

  get rootNode(): HTMLElement {
    return this._rootNode;
  }

  set rootNode(newRootNode: HTMLElement) {
    this._rootNode = newRootNode;
  }

  get database(): Database {
    return this._database;
  }

  set database(newDatabase: Database) {
    this._database = newDatabase;
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

  get emptyTableMessage(): string {
    return this._emptyTableMessage;
  }

  static descendingSort(data: { id: string; value: ScoreModel }[]): { id: string; value: ScoreModel }[] {
    let sortedData: { id: string; value: ScoreModel }[] = [];
    if (data) {
      sortedData = data.sort((a, b) => b.value.points - a.value.points);
    }
    return sortedData;
  }

  static async getTopTen(data: { id: string; value: ScoreModel }[]): Promise<{ id: string; value: ScoreModel }[]> {
    return new Promise((resolve) => {
      resolve(data.slice(0, 9));
    });
  }

  async renderRecords(rootNode: HTMLElement): Promise<void> {
    const data: { id: string; value: ScoreModel }[] = (await this.database.getAllRecords(recordsTableName)) as {
      id: string;
      value: ScoreModel;
    }[];
    if (data.length) {
      const sortedData = Score.descendingSort(data);
      const topTen = await Score.getTopTen(sortedData);
      topTen.forEach(async (record) => {
        const user: { id: string; value: UserModel } = (await this.database.get(record.id, userTableName)) as {
          id: string;
          value: UserModel;
        };
        const tbody: HTMLElement = UI.renderElement(rootNode, 'tbody', null, ['class', 'score__table-body']);
        const tableRow: HTMLElement = UI.renderElement(tbody, 'tr', null, ['class', 'score__table-row']);
        const avatar: HTMLElement = UI.renderElement(
          tableRow,
          'td',
          null,
          ['rowspan', '2'],
          ['class', 'score_table-cell score__avatar']
        );
        UI.renderElement(
          avatar,
          'img',
          null,
          ['class', 'score__avatar-img'],
          ['alt', 'avatar'],
          ['src', `${user.value.avatar}`]
        );
        UI.renderElement(tableRow, 'td', `${user.value.name} ${user.value.surname}`, [
          'class',
          'score_table-cell score__full-name'
        ]);
        UI.renderElement(
          tableRow,
          'td',
          `${record.value.points}`,
          ['rowspan', '2'],
          ['class', 'score_table-cell score__points']
        );
        const tableRow2: HTMLElement = UI.renderElement(tbody, 'tr', null, ['class', 'score__table-row']);
        UI.renderElement(tableRow2, 'td', `${user.value.email}`, ['class', 'score_table-cell score__email']);
      });
    }
    if (!data.length) {
      const tbody: HTMLElement = UI.renderElement(rootNode, 'tbody', null, ['class', 'score__table-body']);
      const tr: HTMLElement = UI.renderElement(tbody, 'tr', null, ['class', 'score__table-row']);
      UI.renderElement(tr, 'td', this.emptyTableMessage, ['colspan', '3'], ['class', 'score__empty-info']);
    }
  }

  render(rootNode: HTMLElement): void {
    this._rootNode = rootNode;
    this.htmlElement = UI.renderElement(this.rootNode, 'div', null, ['class', 'score']);
    const scoreContainer: HTMLElement = UI.renderElement(this.htmlElement, 'div', null, ['class', 'score__container']);
    UI.renderElement(scoreContainer, 'h2', this.title, ['class', 'score__title']);
    const tableContainer: HTMLElement = UI.renderElement(scoreContainer, 'div', null, [
      'class',
      'score__table-container'
    ]);
    const table: HTMLElement = UI.renderElement(tableContainer, 'table', null, ['class', 'score__table']);
    this.renderRecords(table);
  }
}
