import { useState } from 'react'
import './flip.css'

export default function Flip() {

  const [ playing, setPlayStatus ] = useState(false)

  const toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (playing) return
    setPlayStatus(true)
    let target = (e.currentTarget as HTMLDivElement)
    let page = target.getAttribute('data-page')
    if (target.classList.contains('rotated')) {
      target.classList.remove('rotated')
      setTimeout(() => {
        target.style.zIndex = '0'
      }, 1000)
    } else {
      target.classList.add('rotated')
      target.style.zIndex = page
    }
    setTimeout(() => {
      setPlayStatus(false)
    }, 1000)
  }
  return (
    <div className="body">
      <div className="cover">
        <div className="book">
          <div className="book__page book__page--cover">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/193203/1111.jpg" alt="" />
          </div>
          
          <div onClick={ toggle } data-page="3" className="book__page book__page--3">
            <div className="book__page-front">
              front2
            </div>
            <div className="book__page-back">
              back2
            </div>
          </div>
          <div onClick={ toggle } data-page="1" className="book__page book__page--1">
            <div className="book__page-front">
              front1
            </div>
            <div className="book__page-back">
              back1
            </div>
          </div>
        </div>
      </div>`
    </div>
  )
}