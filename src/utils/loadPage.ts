import * as pdfjs from 'pdfjs-dist/webpack'

export const pdfView = () => {
  let pdf = 'https://resource.lungern.tech/FknqbeC4oqdQTm89W4ILRigewVcj'
  const loadingTask = pdfjs.getDocument(pdf)
  loadingTask.promise.then(pdf => {
    console.log(pdf)
    pdf.getPage(2).then(page => {
      const viewport = page.getViewport({ scale: 1.5 })
      let canvas = document.getElementById('page1') as HTMLCanvasElement
      let context = canvas.getContext('2d')
      canvas.width = viewport.width
      canvas.height = viewport.height
      console.log(viewport.width)
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`
      let renderContext = {
        canvasContext: context,
        transform: [1, 0, 0, 1, 0, 0],
        viewport: page.getViewport({ scale: 1.5, })
      }
      page.render(renderContext);
    })
  })
}

export default class PDF {
  pdfLinkList = []

  ifPieceFiles = false

  _pdfCache = new Map<String, any>()

  width = 0

  height = 0

  fileRange = []

  _pageFileMap = new Map<Number, String>()

  _cachePage = new Map<Number, HTMLCanvasElement>()

  constructor(options: { linkList: Array<string>, ifPieceFiles: boolean }) {
    this.pdfLinkList = options.linkList
    this.ifPieceFiles = options.ifPieceFiles
  }

  _loadFile(filePath: string) {
    const loadingTask = pdfjs.getDocument(filePath)
    return loadingTask.promise.then(pdf => {
      this._pdfCache.set(filePath, pdf)
    })
  }

  renderPage(canvas: HTMLCanvasElement, pageNumber: number, config: {width: number, height: number}) {
    if (this._cachePage.get(pageNumber)) return
    let filePath = this._pageFileMap.get(pageNumber) as string || this.pdfLinkList[0]
    let pdf = this._pdfCache.get(filePath)
    let realPage = this._getRealPage(pageNumber)
    if (pdf) {
      pdf.getPage(realPage).then(page => {
        const viewport = page.getViewport({ scale: 1 })
        let context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`
        let renderContext = {
          canvasContext: context,
          transform: [1, 0, 0, 1, 0, 0],
          viewport: page.getViewport({ scale: 1, })
        }
        page.render(renderContext);
        this._cachePage.set(pageNumber, canvas)
      })
    } else {
      this._loadFile(filePath).then(() => this.renderPage(canvas, pageNumber, config))
    }
  }

  _getRealPage(pageNumber: number) {
    if (!this.ifPieceFiles) return pageNumber
    
  }



  renderText(pageNumber: number) {

  } 

  destroy() {

  }

}