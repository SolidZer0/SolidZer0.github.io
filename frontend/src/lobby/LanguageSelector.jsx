import React, { useReducer, useEffect } from 'react'

const FORM_METHODS = {
    CAMPO: 0,
}

const reducerLanguage = (state, action) => {
    switch (action.type) {
        case FORM_METHODS.CAMPO: {
            return { ...state, [action.name]: action.value }
        }
        default:
            return { ...state }
    }
}

const LanguageSelector = ({ idiomas=[], actual, action}) => {
    const [state, dispatch] = useReducer(reducerLanguage, {
        idiomas: [],
        options: []
    })

    useEffect(() => {
        dispatch({type:FORM_METHODS.CAMPO, name:'idiomas', value: idiomas})
        let options = []
        idiomas.forEach( (el) => {
            options.push(<option value={el.id} key={el.id}>{el.culture_display_name}</option>)
        })

        dispatch({type:FORM_METHODS.CAMPO, name:'options', value: options})
    }, [idiomas])

    return (
        <>
            <div className="inputs lang-select">
                <div className="buscar_item">
                    <p className="viaje-label">Languge:</p>
                    <select className="combo_natural" defaultValue={actual} onChange={(e)=>{ action(e.currentTarget.value) }}>
                        {state.options}
                    </select>
                </div>
            </div>            
        </>)
}

export default LanguageSelector