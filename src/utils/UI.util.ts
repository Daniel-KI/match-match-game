export default class UI {
  static renderElement(parent: HTMLElement, tagName: string, innerHTML: string, ...attr: string[][]): HTMLElement {
    const element: HTMLElement = document.createElement(tagName);

    if (attr.length) {
      attr.forEach(([attribute, value]) => {
        element.setAttribute(attribute, value);
      });
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    if (parent) {
      parent.append(element);
    }
    return element;
  }
}
