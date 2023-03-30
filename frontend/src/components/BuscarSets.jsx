import React, { useReducer, useEffect } from 'react'
import { Modal } from './util/modal'
import SetChoices from "./SetChoices";
import SelectSet from "./SelectSet";

const FORM_METHODS = {
    SET_SETS: 0,
    ADD_SET: 1,
    SET_SELECCION: 2,
    SET_SETS_SELECCIONADOS: 3,
    SET_SETS_INPUT: 4,
    CARGANDO: 5,
    CAMPO: 6,
}

const reducerBusqueda = (state, action) => {
    switch (action.type) {
        case FORM_METHODS.CARGANDO: {
            return { ...state, cargando: action.value }
        }
        case FORM_METHODS.SET_SETS: {
            const sets = action.value.filter((el)=>{
                if(el.booster){
                    return el
                }
            })
            return { ...state, sets: sets }
        }
        case FORM_METHODS.SET_SELECCION: {
            const set_actual =JSON.parse(action.set_actual)
            return { ...state, set_actual: set_actual, sets_seleccionados: [...state.sets_seleccionados, set_actual] }
        }
        case FORM_METHODS.ADD_SET: {
            return { ...state, sets_seleccionados: [...state.sets_seleccionados, state.set_actual] }
        }
        case FORM_METHODS.SET_SETS_SELECCIONADOS: {
            return { ...state, sets_seleccionados: action.sets }
        }
        case FORM_METHODS.SET_SETS_INPUT: {
            return { ...state, set_input: action.set_input }
        }
        case FORM_METHODS.CAMPO: {
            return { ...state, [action.name]: action.value }
        }
        default:
            return { ...state }
    }
}

const BuscarSets = ({action, traduccion={}}) => {
    const [state, dispatch] = useReducer(reducerBusqueda, {
        sets: [],
        set_actual: {},
        sets_seleccionados: [],
        set_input: "",
        importExport: false,
        cargando: false,
        dewgong_size: 36
    })

    function set_sets_input() {
        try {
            const sets_import = JSON.parse(state.set_input)
            dispatch({ type: FORM_METHODS.SET_SETS_SELECCIONADOS, sets: sets_import })
            dispatch({ type: FORM_METHODS.SET_SETS_INPUT, set_input: '' })
            dispatch({type:FORM_METHODS.CAMPO,name:'set_actual', value: sets_import[sets_import.length - 1]})
            dispatch({type:FORM_METHODS.CAMPO,name:'importExport', value: false})
        } catch (error) {
            alert("Importación inválida")
        }
    }
    function addSet() {
        dispatch({ type: FORM_METHODS.ADD_SET })
    }
    function eliminarSet(idx){
        const temp = state.sets_seleccionados.filter((el, index)=>{
            if(index != idx)
                return el
        })
        dispatch({ type: FORM_METHODS.SET_SETS_SELECCIONADOS, sets: temp })
    }
    function set_value(e) {
        e.preventDefault()
        dispatch({ type: FORM_METHODS.CAMPO, name: e.target.name, value: e.target.value })
    }
    useEffect(() => {
        //dispatch({ type: FORM_METHODS.SET_SELECCION, set_actual: '{"code": "M21", "name": "Core Set 2021"}' })        
    }, [])

    return (
        <>
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
            <div className="inputs">
                <div className="buscar_item">
                    <p className="viaje-label">{"t4chooseaset" in traduccion ? traduccion.t4chooseaset : "Selecciona un Set"}:</p>
                    {/*<select className="combo_natural" onChange={(e)=>{ dispatch({ type: FORM_METHODS.SET_SELECCION, set_actual: e.currentTarget.value }) }}>
                        <SetChoices milanesa={true}/>
                    </select>*/}
                    <SelectSet
                        value={JSON.stringify(state.set_actual)}
                        onChange={(e) =>{ dispatch({ type: FORM_METHODS.SET_SELECCION, set_actual: e }) }}
                    />
                </div>              
                {/*<div className="buscar_item">
                    <button disabled={!state.set_actual.code} className="viaje-btn" onClick={addSet}>{"t5addset" in traduccion ? traduccion.t5addset : "Agregar Set"}</button>
                </div>*/}
            </div>
            <div className="sets_block">
                <div className="sets">
                    <ul>
                        {state.sets_seleccionados.map((item, index) => {
                            return <li className={`mtg_sets ${index > 17 ? "mucho" : ""}`} key={index}>
                                    <div className="mtg_set_nameicon">
                                        <span className="mtg_setname">{`${index+1}° ${item.name}`}</span>
                                        <i style={{fontSize: "25px"}} className={`mtg_seticon ss ss-${item.code.toLowerCase()}`} />
                                    </div>                                        
                                    <button className="set_delete" onClick={()=>{eliminarSet(index)}}>X</button>
                                </li>
                        })}
                    </ul>
                </div>
                {state.importExport ? 
                    <></> :
                    <div className="entrada centrado">
                        <button className="viaje-btn" onClick={() => { dispatch({type:FORM_METHODS.CAMPO,name:'importExport', value: true}) }}>{"t6showimportexport" in traduccion ? traduccion.t6showimportexport : "Mostrar Import/Export"}</button>
                    </div>}
                    {state.importExport ? 
                    <><div className="entrada datos">
                        <textarea className="sets_input" value={state.set_input} onChange={(e)=>{
                            dispatch({ type: FORM_METHODS.SET_SETS_INPUT, set_input: e.target.value })
                        }}></textarea>
                        <button className="viaje-btn" onClick={set_sets_input}>{"t7importsets" in traduccion ? traduccion.t7importsets : "IMPORTAR SETS"}</button>
                    </div>
                    <div className="salida datos">
                        <h4 className="centrado">{"t7zexportsets" in traduccion ? traduccion.t7zexportsets : "Exportar sets"}</h4>
                        <textarea readOnly={true} onFocus={(e) => {e.target.select()}} className="sets_input" value={JSON.stringify(state.sets_seleccionados)}></textarea>
                    </div></> : <></>}                
            </div>
            {state.sets_seleccionados.length > 0 ?
                <div style={{"flexDirection" : "row"}} className="buscar_item">
                    <button style={{"marginRight" : "5px"}} className="draft-btn" onClick={()=>{action(state.sets_seleccionados)}}>MILANESA!</button>
                    <button style={{"margin" : "0 10px 0 5px"}} className="draft-btn" onClick={()=>{action(state.sets_seleccionados, true, state.dewgong_size)}}>DEWGONG!</button>
                    <input value={state.dewgong_size} className="input" name="dewgong_size" onChange={set_value} type="number"/>
                </div> : <></>}
            <div className="draft_header">
                <h2 className="h2_home"> 
                    <pre>{"t8choosethesetsfor1" in traduccion ? traduccion.t8choosethesetsfor1 : "¡Escoge los sets para la "} </pre>
                    <span className="h2_main">{"t9choosethesetsfor2" in traduccion ? traduccion.t9choosethesetsfor2 : "Milanesa!"}</span>
                </h2>
            </div>
        </>)
}

export { BuscarSets }