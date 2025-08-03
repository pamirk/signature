import interact from 'interactjs';

interface InteractingParams {
  draggableOptions?: Partial<Interact.OrBoolean<Interact.DraggableOptions>>;
  resizableOptions?: Partial<Interact.OrBoolean<Interact.ResizableOptions>>;
}

interface RearrangeFontSizeParams {
  shadowElement: HTMLElement;
  initialFontSize: number;
  maxFontSize?: number;
  minFontSize?: number;
  checkHeight?: boolean;
  checkWidth?: boolean;
  isAsync?: boolean;
  isFixedFontSize?: boolean;
}

class Interact {
  constructor(
    readonly node: HTMLElement,
    readonly resizeParentNode?: HTMLElement,
    readonly dragParentNode?: HTMLElement,
  ) {}

  static readonly getNodeCoords = (node: HTMLElement) => ({
    x: parseFloat(node.getAttribute('coord-x') || '') || 0,
    y: parseFloat(node.getAttribute('coord-y') || '') || 0,
  });

  static readonly getNodeFontSize = (node: HTMLElement) =>
    parseInt(node.getAttribute('font-size') || '', 10);

  static readonly getNodeSize = (node: HTMLElement) => ({
    width: parseFloat(node.getAttribute('size-width') || '') || 0,
    height: parseFloat(node.getAttribute('size-height') || '') || 0,
  });

  static readonly setNodeCoords = (node: HTMLElement, x: number, y: number) => {
    node.setAttribute('coord-x', x.toString());
    node.setAttribute('coord-y', y.toString());
  };

  static readonly setNodeSize = (node: HTMLElement, width: number, height: number) => {
    node.setAttribute('size-width', width.toString());
    node.setAttribute('size-height', height.toString());
  };

  static readonly dragMoveListener = (event, documentScale = 1) => {
    const { target, dx, dy } = event;

    const { x: coordX, y: coordY } = Interact.getNodeCoords(target);
    const x = coordX + dx / documentScale;
    const y = coordY + dy / documentScale;

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    Interact.setNodeCoords(target, x, y);
  };

  static readonly resizeMoveListener = (event, documentScale = 1) => {
    const target = event.target as HTMLElement;
    const { left: dx, top: dy, width: dWidth, height: dHeight } = event.deltaRect;
    const { width: rectWidth, height: rectHeight } = event.rect;
    const { x: coordX, y: coordY } = Interact.getNodeCoords(target);
    const { width: widthSize, height: heightSize } = Interact.getNodeSize(target);

    const x = coordX + dx / documentScale;
    const y = coordY + dy / documentScale;
    const width = (widthSize || rectWidth / documentScale) + dWidth / documentScale;
    const height = (heightSize || rectHeight / documentScale) + dHeight / documentScale;

    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    Interact.setNodeCoords(target, x, y);
    Interact.setNodeSize(target, width, height);
  };

  static async getRearrangedFontSize({
    shadowElement,
    initialFontSize,
    maxFontSize = 48,
    minFontSize = 7,
    checkHeight = true,
    checkWidth = false,
    isAsync = false,
    isFixedFontSize = false,
  }: RearrangeFontSizeParams) {
    let fontSize = initialFontSize;

    if (shadowElement && !isFixedFontSize) {
      const parent = shadowElement.parentElement as HTMLElement;

      while (
        ((checkHeight && shadowElement.offsetHeight <= parent.offsetHeight) ||
          (checkWidth && shadowElement.offsetWidth <= parent.offsetWidth)) &&
        fontSize < maxFontSize
      ) {
        isAsync && (await new Promise(resolve => setTimeout(resolve)));
        fontSize++;
        shadowElement.style.fontSize = fontSize + 'px';
      }

      while (
        ((checkHeight && shadowElement.offsetHeight > parent.offsetHeight) ||
          (checkWidth && shadowElement.offsetWidth > parent.offsetWidth)) &&
        fontSize > minFontSize
      ) {
        isAsync && (await new Promise(resolve => setTimeout(resolve)));
        fontSize--;
        shadowElement.style.fontSize = fontSize + 'px';
      }

      if (fontSize < minFontSize) {
        return;
      }
    }

    return fontSize;
  }

  static setNodeFontSize = (node: HTMLElement, fontSize: number) => {
    node.setAttribute('font-size', `${fontSize}`);
  };

  static rearrangeFontSizeAsync = async (
    node: HTMLElement,
    options?: Partial<RearrangeFontSizeParams>,
  ) => {
    const shadowParent = node.firstChild?.firstChild as HTMLElement;

    const newFontSize = await Interact.getRearrangedFontSize({
      shadowElement: shadowParent?.firstChild as HTMLElement,
      initialFontSize: parseInt(shadowParent.style.fontSize, 10),
      ...options,
    });

    if (newFontSize) {
      shadowParent.style.fontSize = `${newFontSize}px`;

      Interact.setNodeFontSize(node, newFontSize);
    }
  };

  getInteractable = () => interact(this.node);

  interacting = (options?: InteractingParams) => {
    return this.getInteractable()
      .draggable({
        inertia: false,
        modifiers: [
          interact.modifiers.restrict({
            restriction: this.dragParentNode,
            elementRect: {
              top: 0,
              left: 0,
              bottom: 1,
              right: 1,
            },
          }),
        ],
        ...options?.draggableOptions,
      })
      .resizable({
        inertia: false,
        restrictEdges: {
          outer: this.resizeParentNode,
          elementRect: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          },
        },
        edges: {
          left: [
            '.fieldDropDown__trigger-triangle--left',
            '.fieldDropDown__trigger-triangle--topLeft',
            '.fieldDropDown__trigger-triangle--bottomLeft',
          ],
          right: [
            '.fieldDropDown__trigger-triangle--right',
            '.fieldDropDown__trigger-triangle--topRight',
            '.fieldDropDown__trigger-triangle--bottomRight',
          ],
          bottom: [
            '.fieldDropDown__trigger-triangle--bottom',
            '.fieldDropDown__trigger-triangle--bottomLeft',
            '.fieldDropDown__trigger-triangle--bottomRight',
          ],
          top: [
            '.fieldDropDown__trigger-triangle--top',
            '.fieldDropDown__trigger-triangle--topLeft',
            '.fieldDropDown__trigger-triangle--topRight',
          ],
        },
        ...options?.resizableOptions,
      } as any);
  };
}

export default Interact;
