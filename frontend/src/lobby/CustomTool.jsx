//import React, { useReducer, useEffect } from 'react'
import React, { useReducer } from 'react'
import { Modal } from '../components/util/modal'

const FORM_METHODS = {
    CARGANDO: 0,
    CAMPO: 1,
}

const reducerBusqueda = (state, action) => {
    switch (action.type) {
        case FORM_METHODS.CARGANDO: {
            return { ...state, cargando: action.value }
        }
        case FORM_METHODS.CAMPO: {
            return { ...state, [action.name]: action.value }
        }
        default:
            return { ...state }
    }
}

const CustomTool = () => {
    const [state, dispatch] = useReducer(reducerBusqueda, {
        nombre: "",
        set_code: {},
        cards: [],
        cargando: false
    })

    /*useEffect(() => {
    }, [])*/

    return <div className="buscar_viaje_container venta_container">
        <Modal close={() => { }}
            title={""}
            estado={state.cargando}
            showClose={false}>
            <div className="dflexcc">
                <div className="lds-ellipsis">
                    <div></div><div></div><div></div><div></div>
                </div>
            </div>
        </Modal>
        <div className="buscar_viaje">
            <h2 className="titulo">¡Construyamos tu <span className="subtitulo">Custom Set!</span></h2>            
            <div className="inputs">
                <div className="buscar_item">
                    <p className="viaje-label">Nombre del Set:</p>
                    <input className="input control" value={state.nombre} onChange={(e)=>{ dispatch({type:FORM_METHODS.CAMPO,name: 'nombre', value: e.target.value }) }}/>
                </div>
                <div className="buscar_item">
                    <p className="viaje-label">Código del Set:</p>
                    <input className="input control" value={state.set_code} onChange={(e)=>{ dispatch({type:FORM_METHODS.CAMPO,name: 'set_code', value: e.target.value }) }}/>
                </div>
                {/*<div className="buscar_item">
                    <button disabled={!state.set_actual.code} className="viaje-btn" onClick={addSet}>Agregar Set</button>
                </div>*/}
            </div>
            {/*<div className="sets_block">
                <div className="sets">
                    <ul>
                        {state.sets_seleccionados.map((item, index) => {
                            return <li className={`mtg_sets ${index > 17 ? "mucho" : ""}`} key={index}>{index+1}° {item.name}       <button className="set_delete" onClick={()=>{eliminarSet(index)}}>X</button></li>
                        })}
                    </ul>
                </div>
                {state.importExport ? 
                    <></> :
                    <div className="entrada centrado">
                        <button className="viaje-btn" onClick={() => { dispatch({type:FORM_METHODS.CAMPO,name:'importExport', value: true}) }}>Mostrar Import/Export</button>
                    </div>}
                    {state.importExport ? 
                    <><div className="entrada datos">
                        <textarea className="sets_input" value={state.set_input} onChange={(e)=>{
                            dispatch({ type: FORM_METHODS.SET_SETS_INPUT, set_input: e.target.value })
                        }}></textarea>
                        <button className="viaje-btn" onClick={set_sets_input}>IMPORTAR SETS</button>
                    </div>
                    <div className="salida datos">
                        <h4 className="centrado">Exportar sets</h4>
                        <textarea readOnly={true} onFocus={(e) => {e.target.select()}} className="sets_input" value={JSON.stringify(state.sets_seleccionados)}></textarea>
                    </div></> : <></>}                
            </div>*/}
            {/*state.sets_seleccionados.length > 0 ?
                <div style={{"flex-direction" : "row"}} className="buscar_item">
                    <button style={{"margin-right" : "5px"}} className="draft-btn" onClick={()=>{action(state.sets_seleccionados)}}>MILANESA!</button>
                    <button style={{"margin" : "0 10px 0 5px"}} className="draft-btn" onClick={()=>{action(state.sets_seleccionados, true, state.dewgong_size)}}>DEWGONG!</button>
                    <input value={state.dewgong_size} className="input" name="dewgong_size" onChange={set_value} type="number"/>
            </div> : <></>*/}
            <div className="draft_header">
                <h2 className="h2_home"> 
                    <pre>¡Escoge los sets para la  </pre>  
                    <span className="h2_main">Milanesa!</span>
                </h2>
            </div>
        </div>
    </div>
}

export default CustomTool