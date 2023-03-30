import React, { useRef, useEffect } from 'react'
import { Close } from '../../components/util/Icons'


const Modal = ({ children=null,estado=false, close, title='',showClose=true, up=false, terminos=false, noMaxWidth=false }) => {
  const inputEl = useRef(null);
  useEffect(() => {
    if(estado){
      document.getElementsByTagName('body')[0].classList.add('modal_abierto')
    }
    return ()=>{
      document.getElementsByTagName('body')[0].classList.remove('modal_abierto')
    }
  }, [estado])
  return (estado ? <div className="modal_container" ref={inputEl}>
    <div className="vhidden">{title}</div>
    <div className={`${noMaxWidth ? "modal_content_nomax":"modal_content"} ${up ? "up" : ""} ${terminos ? "termcon" : ""}`}>
      <span className="btnmodal_close" >
        <span className="milanesa_modal">
          <img src="../../static/MTG.svg" />
        </span>
        {
          showClose?
        <div className="close_icon" onClick={close}>
          <Close />
        </div>:<div></div>
        }
      </span>
      {children}
    </div>
  </div> : <></>)
}

export { Modal }