import { useEffect, useRef, useState } from 'react'
import randomKey from '../utils/randomKey.ts'
import './flip.css'

export default function Flip(props: { pageChange: (pageNumber: number, canvas: HTMLCanvasElement) => void }) {

  const [ playing, setPlayStatus ] = useState(false)

  const [ pageNumber, setPageNumber ] = useState(1)

  const [ direction, setDirection ] = useState('')

  const [ pageKey, setPageKey] = useState({ [pageNumber]: randomKey() })

  const pageRef = useRef<HTMLCanvasElement[]>([])

  

  const toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (playing) return
    setPlayStatus(true)
    let target = e.currentTarget as HTMLDivElement
    if (target.classList.contains('book__page-front')) {
      setPageKey({
        [pageNumber + 1]: randomKey(),
        [pageNumber + 2]: randomKey(),
        ...pageKey,
      })
      setDirection('forth')
      setPageNumber(pageNumber + 2)
    } else if (target.classList.contains('book__page-back')) {
      setPageKey({
        [pageNumber -1]: randomKey(),
        [pageNumber - 2]: randomKey(),
        ...pageKey,
      })
      setDirection('back')
      setPageNumber(pageNumber - 2)
    }
    setTimeout(() => {
      setPlayStatus(false)
    }, 1000)
  }

  useEffect(() => {
    console.log(pageNumber)
    props.pageChange(pageNumber, pageRef.current[pageNumber])
    props.pageChange(pageNumber + 1, pageRef.current[pageNumber + 1])

  }, [ pageNumber ])
  return (
    <div className="body">
      <div className="cover">
        <div className="book">
          <div className="book__page book__page--cover">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/193203/1111.jpg" alt="" />
          </div>
          {
            Object.keys(pageKey).sort((a, b) => Number(b) - Number(a)).filter(e=> Number(e) % 2 !== 0).map(e => {
              return (
                <div key={ pageKey[e] } data-page={e}
                  style={{
                    zIndex: playing && ((direction === 'forth' && Number(e) <= pageNumber - 2) || (direction === 'back' && Number(e) <= pageNumber)) || !playing && Number(e) < pageNumber ? Number(e) : 0
                  }}
                 className={
                   `book__page book__page--${e} ${Math.abs(pageNumber - Number(e)) > 7 ? "hidden": ''} ${Number(e) < pageNumber ? 'rotated': ''}`
                    }>
                  <div onClick={ toggle } className="book__page-front">
                    <canvas ref={ ele => pageRef.current[Number(e)] = ele }></canvas>
                    <span style={{"marginTop": "-30px", 'display': 'block', 'position': 'relative'}} >{e}/{ pageNumber }</span>
                  </div>
                  <div onClick={ toggle } className="book__page-back">
                    <canvas ref={ ele => pageRef.current[Number(e) + 1] = ele }></canvas>
                    <span style={{"marginTop": "-30px", 'display': 'block', 'position': 'relative'}} >{ Number(e) + 1 }/{ pageNumber }</span>
                  </div>
                </div>
                )
            })
          }
        </div>
      </div>
    </div>
  )
}