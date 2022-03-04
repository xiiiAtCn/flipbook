import { useEffect } from 'react';
import './App.css';
import Flip from './components/Flip.tsx';
import PDF from './utils/loadPage.ts';

function App() {
  let pdf!: any;
  useEffect(() => {
    pdf = new PDF({
      linkList: ['https://resource.lungern.tech/FknqbeC4oqdQTm89W4ILRigewVcj'],
      ifPieceFiles: false,
    })
    
  })

  const pageChange = (page: number, container: HTMLCanvasElement) => {
    if (!pdf) return
    pdf.renderPage(container, page)
  }
  return (
    <div className="App">
      <Flip pageChange={ pageChange } />
    </div>
  );
}

export default App;
