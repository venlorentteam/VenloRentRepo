import React, { useState } from 'react'
import './Modal.css'
import { FaXmark } from "react-icons/fa6"

function Modal({data = [], cancel=true}){
  const [modal, setModal] = useState()

  const toggleModal = ()=>{
    setModal(modal => !modal)
  }
  return (
    <>
      <div className={`overlay ${modal ? 'inactive-overlay' : ''}`}></div>
      <div className={`modal ${modal ? 'inactive-modal' : ''}`}>
        {cancel && <span className="cancel" onClick={toggleModal}><FaXmark /></span>}
        {data.map((item, i)=>(
          <div key={i}>
            {/* modal pop ups for various actions */}
            {item.modalTitle && <h2>{item.modalTitle}</h2>}
            {item.modalText && <p>{item.modalText}</p>}
            {item.modalExtra && item.modalExtra}
          </div>
        ))}
      </div>
    </>
  )
}

export default Modal  
