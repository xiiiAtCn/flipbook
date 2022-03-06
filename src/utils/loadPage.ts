import * as pdfjs from "pdfjs-dist/webpack";
export default class PDF {
  pdfLinkList = [];

  ifPieceFiles = false;

  _pdfCache = new Map<String, any>();

  width = 0;

  height = 0;

  fileRange = [];

  _pageFileMap = new Map<Number, String>();

  _cachePage = new Map<Number, HTMLCanvasElement>();

  constructor(options: {
    linkList: Array<string>;
    ifPieceFiles: boolean;
    height: number;
    width: number;
  }) {
    this.pdfLinkList = options.linkList;
    this.ifPieceFiles = options.ifPieceFiles;
    this.width = options.width;
    this.height = options.height;
  }

  _loadFile(filePath: string) {
    const loadingTask = pdfjs.getDocument(filePath);
    return loadingTask.promise.then((pdf) => {
      this._pdfCache.set(filePath, pdf);
    });
  }

  renderPage(
    canvas: HTMLCanvasElement,
    pageNumber: number,
    config: { height: number; width: number }
  ) {
    // if (this._cachePage.get(pageNumber)) return;
    let filePath =
      (this._pageFileMap.get(pageNumber) as string) || this.pdfLinkList[0];
    let pdf = this._pdfCache.get(filePath);
    let realPage = this._getRealPage(pageNumber);
    if (pdf) {
      return pdf.getPage(realPage).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        let context = canvas.getContext("2d");
        let ratio = this.height / viewport.height;
        canvas.width = ratio * viewport.width;
        canvas.height = ratio * viewport.height;
        canvas.style.width = `${ratio * viewport.width}px`;
        canvas.style.height = `${ratio * viewport.height}px`;
        let renderContext = {
          canvasContext: context,
          transform: [1, 0, 0, 1, 0, 0],
          viewport: page.getViewport({ scale: ratio }),
        };
        page.render(renderContext);
        this._cachePage.set(pageNumber, canvas);
        return {
          height: canvas.height,
          width: canvas.width,
        };
      });
    } else {
      return this._loadFile(filePath).then(() =>
        this.renderPage(canvas, pageNumber, config)
      );
    }
  }

  _getRealPage(pageNumber: number) {
    if (!this.ifPieceFiles) return pageNumber;
  }

  renderText(pageNumber: number) {}

  destroy() {}
}
