import { useEffect, useRef, useState } from "react";
import "./App.css";
import Flip from "./components/Flip.tsx";
import PDF from "./utils/loadPage.ts";

function App() {
  const [loadStatus, setLoadStatus] = useState(false);

  let [pdf, setPdf] = useState(null);

  const bookRef = useRef<HTMLDivElement>();

  useEffect(() => {
    let position = bookRef.current.getBoundingClientRect();
    pdf = new PDF({
      linkList: ["https://resource.lungern.tech/FknqbeC4oqdQTm89W4ILRigewVcj"],
      ifPieceFiles: false,
      width: 0,
      height: position.height * 0.9,
    });
    setPdf(pdf);
    setLoadStatus(true);
  }, []);

  const pageChange = (page: number, container: HTMLCanvasElement) => {
    if (!pdf) return;
    pdf.renderPage(container, page).then((config) => {
      bookRef.current.style.width = `${config.width * 2}px`;
      bookRef.current.style.height = `${config.height}px`;
    });
  };
  return (
    <div className="book" ref={bookRef}>
      {loadStatus ? <Flip pageChange={pageChange} /> : <>loading</>}
    </div>
  );
}

export default App;
