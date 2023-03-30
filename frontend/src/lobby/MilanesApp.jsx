import React, { useEffect, useReducer } from 'react'
import FileUpload from "./FileUpload";
//import CustomTool from "./CustomTool"; 
import LanguageSelector from "./LanguageSelector";
import { BuscarSets } from '../components/BuscarSets'
import { Modal } from '../components/util/modal'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { generar_booster, adquirir_idiomas, adquirir_traducciones } from '../components/servicios/services'

const METHODS = {
  SET_SELECCION: 0,
  SET_SETS_DRAFT: 1,
  CARGANDO: 2,
  ADD_BOOSTER: 3,
  CAMPO: 4,
  SET_PICKS: 5,
  SET_IDIOMAS: 6,
  SET_IDIOMA: 7,
  SET_TRADUCCION: 8
}


const reducer = (state, action) => {
  switch (action.type) {
      case METHODS.CARGANDO: {
          return { ...state, cargando: action.value }
      }
      case METHODS.SET_SELECCION: {
          const set_actual =JSON.parse(action.set_actual)
          return { ...state, set_actual: set_actual }
      }
      case METHODS.SET_SETS_DRAFT: {
          return { ...state, sets_draft: action.sets_draft }
      }
      case METHODS.SET_PICKS: {
        return { ...state, picks: action.picks }
      }
      case METHODS.ADD_BOOSTER: {
        return { ...state, boosters_completos: [...state.boosters_completos, action.booster] }
      }
      case METHODS.SET_IDIOMAS: {
        return { ...state, idiomas: action.idiomas }
      }
      case METHODS.SET_IDIOMA: {
        return { ...state, idioma: action.idioma }
      }
      case METHODS.SET_TRADUCCION: {
        return { ...state, traduccion: action.traduccion }
      }
      case METHODS.CAMPO: {
          return { ...state, [action.name]: action.value }
      }
      default:
          return { ...state }
  }
}

const MilanesApp = ({base}) => {
  const [state, dispatch] = useReducer(reducer, {
    sets_draft: [],
    picks: [],
    selector: true,
    draft: false,
    building: false,
    cargando: false,
    dewgong: false,
    idiomas: [{
      "id": 326,
      "culture_name": "es",
      "culture_display_name": "Spanish"
    }],
    idioma: 326,
    traduccion: {
      "t1loading": "Cargando...",
      "t2choosesomesets1": "¡Elige los sets y ",
      "t3choosesomesets2": "MILANESA!",
      "t4chooseaset": "Selecciona un Set",
      "t5addset": "Agregar Set",
      "t6showimportexport": "Mostrar Importar/Exportar",
      "t7importsets": "IMPORTAR SETS",
      "t7zexportsets": "Exportar sets",
      "t8choosethesetsfor1": "Escoge los sets para la",
      "t9choosethesetsfor2": "Milanesa!",
      "t10uploadcustomset": "Cargar Set Personalizado",
      "t11dragdrop1": "Arrastra y suelta tus archivos aquí, o",
      "t12dragdrop2": "Explora",
      "t13dragdrop": "Soporte para formato JSON (MTGJSON v4/v5) y/o XML (Cockatrice v3/v4)."
    }
  })

  async function go_draft(sets=[], dewgong=false, dewgong_size=36) {

    dispatch({ type: METHODS.CARGANDO, value: true })

    let temp = [...sets]

    const boosters_cant = (dewgong ? dewgong_size : 18)

    while (temp.length < boosters_cant) {
      for (let n = 0; (n < sets.length && temp.length < boosters_cant); n++) {
          temp.push(sets[n])
      }
    }

    temp = temp.slice(0, boosters_cant)

    if(dewgong){
      dispatch({type:METHODS.CAMPO,name:'dewgong', value: true})
    }
    dispatch({ type: METHODS.SET_SETS_DRAFT, sets_draft: temp })
    dispatch({type:METHODS.CAMPO,name:'selector', value: false})
    dispatch({type:METHODS.CAMPO,name:'draft', value: true})

    dispatch({ type: METHODS.CARGANDO, value: false })
  }

  async function go_build(picks) {
    dispatch({ type: METHODS.CARGANDO, value: true })
    
    dispatch({type:METHODS.CAMPO,name:'draft', value: false})
    dispatch({ type: METHODS.SET_PICKS, picks: picks })
    dispatch({type:METHODS.CAMPO,name: 'building', value: true})

    dispatch({ type: METHODS.CARGANDO, value: false })
  }

  async function fetchIdiomas() {
    try {      
      const idiomas = await adquirir_idiomas()
      if (!idiomas || idiomas.length < 1){
        throw new Error("Error trayendo idiomas");          
      } else {
        dispatch({type:METHODS.SET_IDIOMAS, idiomas: idiomas})
      }
    } catch (error) {
      console.log(error)      
    }
  }

  async function fetchTraduccion(langId) {
    try {      
      const traduccion = await adquirir_traducciones(langId)
      if (!traduccion || traduccion.length < 1){
        throw new Error("Error trayendo traducción");          
      } else {
        dispatch({type:METHODS.SET_TRADUCCION, traduccion: traduccion})
      }
    } catch (error) {
      console.log(error)      
    }
  }

  function setIdioma(id) {
    fetchTraduccion(id)
    dispatch({type:METHODS.SET_IDIOMA, idioma: id})
  }

  useEffect(() => {
    fetchIdiomas()
    fetchTraduccion(state.idioma)
  }, [])

  return (
    <div className={base}>
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
      {<LanguageSelector idiomas={state.idiomas} actual={state.idioma} action={setIdioma} />}
      {state.selector ? <><Selector action={go_draft} traduccion={state.traduccion}/><FileUpload traduccion={state.traduccion}/></> : <></>}
      {state.draft ? <Draft sets_draft={state.sets_draft} action={go_build} carga={(x)=>{dispatch({ type: METHODS.CARGANDO, value: x })}} dewgong={state.dewgong} traduccion={state.traduccion}/> : <></>}      
      {state.building ? <Building picks={state.picks} carga={(x)=>{dispatch({ type: METHODS.CARGANDO, value: x })}} dewgong={state.dewgong} traduccion={state.traduccion}/> : <></>}
      {/*<CustomTool/>*/}
    </div>
  )
}


const Selector = ({ action, traduccion={} }) => {
  
  return <section className="busqueda_section">
    <div className="carousel_section">
      <h1><a style={{"textDecoration" : "none"}} href="https://milanes-app.herokuapp.com/">MilanesApp</a></h1>
    </div>    
    <div className="buscar_viaje_container venta_container">
      <div className="buscar_viaje">
        <h2 className="titulo">{"t2choosesomesets1" in traduccion ? traduccion.t2choosesomesets1 : "¡Elige los sets "}<span className="subtitulo">{"t3choosesomesets2" in traduccion ? traduccion.t3choosesomesets2 : "y MILANESA!"}</span></h2>
      <BuscarSets action={action} traduccion={traduccion}/>
      </div>
    </div>
  </section>
}

const Draft = ({ sets_draft=[], carga, action, dewgong=false, traduccion={}}) => {

  const [state, dispatch] = useReducer(reducer, {
    booster: [],
    boosters_completos: [],
    numero_booster: 0,
    picks_actuales: [],
    export_emergencia: false,
    picks: []
  })

  function esPick(index){
    return state.picks_actuales.includes(index)
  }

  function pickThis(index){

    let temp = [...state.picks_actuales]
    if (esPick(index)) {
      temp = temp.filter((el)=>{ return el != index })
    } else {
      temp.push(index);
      if(temp.length > 2) {
        temp = temp.slice(1, 3)
      }
    }
    dispatch({type:METHODS.CAMPO, name:'picks_actuales', value: temp})
  }

  function exportarDeck( picks = state.picks){
    if (picks.length > 0){
      let texto = `<?xml version="1.0" encoding="UTF-8"?>`
      texto += `<cockatrice_deck version="1">`
      texto += `    <deckname>MilanesaDeck</deckname>`
      texto += `    <comments>Powered by Okiba-Gang`
      try {        
        texto += `




        
        
        
        
        
        `+btoa(JSON.stringify(picks))
      } catch (error) {
        console.log("Falló la Firma")                
      }
      texto += `</comments>`
      
      texto += `    <zone name="side">`

      picks.map((el)=>{
        texto += `        <card number="`+el.cant+`" name="`+(el.isDoubleFaced ? el.name.split(" // ")[0] : el.name)+`"/>`
      })

      texto += `    </zone>`
      texto += `    <zone name="main">`
      texto += `    </zone>`
      texto += `</cockatrice_deck>`
      
      const element = document.createElement("a");
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto));
      element.setAttribute('download', 'MilanesaDeck.cod');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    } else {
      alert("No hay picks...")
    }
  }
  
  function nextBooster(){

    let temp = state.numero_booster + 1    

    let temp_picks = [...state.picks]

    for (let n = 0; n < state.picks_actuales.length; n++) {
      let encontro = false
      
      const cartaBuscar = state.booster[state.picks_actuales[n]].name
      const fullCard = state.booster[state.picks_actuales[n]]
      
      for (let n = 0; n < temp_picks.length; n++) {
        if(temp_picks[n].name == cartaBuscar) {
          encontro = true
          temp_picks[n].cant = temp_picks[n].cant + 1
          break           
        }
      }
      if (!encontro) {
        temp_picks.push({cant: 1, name: cartaBuscar, card: fullCard})
      }
    }

    dispatch({type:METHODS.CAMPO, name:'picks_actuales', value: []})
    dispatch({type:METHODS.CAMPO, name:'booster', value: state.boosters_completos[temp]})
    dispatch({type:METHODS.CAMPO, name:'picks', value: temp_picks})

    if (temp < 18) {
      dispatch({type:METHODS.CAMPO, name:'numero_booster', value: temp})       

    } else {
      
      //exportarDeck(shortPicks)
      action(temp_picks)
    }
  }

  async function fetchBooster(nro) {
    try {      
      let temp_booster = await generar_booster(sets_draft[nro].code)
      if (temp_booster.length < 2){
        throw new Error("Error 500??");          
      }
      temp_booster = temp_booster.reverse()
      if (nro == 0)
        dispatch({type:METHODS.CAMPO, name:'booster', value: temp_booster})      
      dispatch({type: METHODS.ADD_BOOSTER, booster: temp_booster})
    } catch (error) {
      //alert("Error al traer el booster "+(nro+1))
      dispatch({type:METHODS.CAMPO, name:'export_emergencia', value: true})
      console.log(error)      
    }
  }

  async function fetchAllBoosters() {
    carga(true)
    for (let i = 0; i < sets_draft.length; i++) {
      await fetchBooster(i)
    }
    carga(false)
  }
  

  useEffect(() => {
    if (sets_draft.length > 0){
      fetchAllBoosters()
    }
  }, [sets_draft])

  useEffect(() => {
    if(dewgong && state.boosters_completos.length >= sets_draft.length) {
      let pool = []
      state.boosters_completos.map((booster, i)=>{
        //pool.push(booster)
        pool=[...pool, ...booster]
      })

      action(pool)
    }
  }, [state.boosters_completos])

  return <section className="draft_section">
    <div className="draft_header">
      <h2 className="h2_home"> 
        <pre>{"t14packnumber" in traduccion ? traduccion.t14packnumber : "Sobre número"} {state.numero_booster+1}: </pre>  
        <span className="h2_main">{sets_draft[state.numero_booster].name}</span>
      </h2>
      <div className={`loading ${state.boosters_completos.length < sets_draft.length ? "" : "vhidden"}`}>
        <div style={{ width: (100*state.boosters_completos.length/sets_draft.length).toString()+'%' }} className="progress">{state.boosters_completos.length}/{sets_draft.length}</div>
      </div>
    </div>
    {state.boosters_completos.map((booster, index) => {
      return <div className={`draft_container cards_zone ${state.numero_booster == index ? "" : "vhidden"}`} key={index}>
        {booster.map((card, index) => {
            return <div className="draft_card tooltip" key={index} onClick={()=>{pickThis(index)}}>
              <div className={esPick(index) ? "selected" : ""}></div>
              {card.isDoubleFaced ? 
                <div className="tooltipImg">
                  <LazyLoadImage
                    width="230"
                    effect="blur"
                    src={card.flippedCardURL ? card.flippedCardURL+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                    alt={card.name}/>
                </div> : <span className="tooltipText">
                  {card.name}<br/><br/>{card.type}<br/>{card.text}
                  {card.type.includes("Creature") ? <><br/><br/>{card.power}/{card.toughness}</>:<></>}
                </span>}              
              <div className={`card_img ${card.foil ? "foil-card" : ""}`}>
                <LazyLoadImage
                  width="230"
                  effect="blur"
                  src={card.url ? card.url+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                  alt={card.name}/>
              </div>
            </div>
        })}
      </div>
    })}
    <div className="picks">
      <div className="picks_actuales">
        <h2 className="title_label">{"t15thispackpicks" in traduccion ? traduccion.t15thispackpicks : "Picks de este sobre"}:</h2>
        {state.picks_actuales.map((item, index)=>{
          return <h3 className="" key={index}>* {state.booster[item].name}</h3>
        })}
      </div>
      <button disabled={(state.numero_booster < 17 && !state.boosters_completos[state.numero_booster+1]) || state.picks_actuales.length < 2} className="draft-btn" onClick={nextBooster}>{state.numero_booster < 17 ? (state.boosters_completos[state.numero_booster+1] ? (state.picks_actuales.length < 2 ? ("t16mustpicktwo" in traduccion ? traduccion.t16mustpicktwo : "Debe Pickear 2...") :("t17nextpack" in traduccion ? traduccion.t17nextpack : "Siguiente sobre")) : ("t18loadingnextpack" in traduccion ? traduccion.t18loadingnextpack : "Cargando Siguiente sobre...") ) : ("t19godeckbuild" in traduccion ? traduccion.t19godeckbuild : "Go Deckbuild!")}</button>
      {state.export_emergencia ? <button className="draft-btn" onClick={exportarDeck}>{"t20emergencyexport" in traduccion ? traduccion.t20emergencyexport : "Exportación de emergencia"}</button> : <></>}
      <div className="picks_actuales">
        <h2 className="title_label">{"t21mypicks" in traduccion ? traduccion.t21mypicks : "Resumen de Picks:"}</h2>
        {state.picks.map((pick, index)=>{ 
          return <div key={index} className="tooltip">
            <div className="tooltipImg">
              <LazyLoadImage
                width="230"
                effect="blur"
                src={pick.card.url ? pick.card.url+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+pick.card.name+"&type=card"}
                alt={pick.card.name}/>
            </div>
            <h3 className="" style={{cursor: "zoom-in"}} key={index}>{pick.cant} {pick.name}</h3>
          </div>          
        })}
      </div>
    </div>
  </section>
}

const Building = ({ picks=[], carga, dewgong=false, traduccion={} }) => {

  const [state, dispatch] = useReducer(reducer, {
    welcome: false,
    orden: "cmc",
    main: [],
    side: [],
    maybe: []
  })

  function zoneToggle(zona, index){

    let main = [...state.main]
    let side = [...state.side]

    if(zona == "main"){
      if (main[index].name != "Plains" && main[index].name != "Island" && main[index].name != "Swamp" && main[index].name != "Mountain" && main[index].name != "Forest") {
        side.push(main[index])
      }
      main = main.filter((el, idx)=>{
        if(index != idx)
          return el
      })
    } else {
      main.push(side[index])
      side = side.filter((el, idx)=>{
        if(index != idx){
          return el
        }
      })
    }

    dispatch({type:METHODS.CAMPO, name:'main', value: ordenaLista(ordenaLista(main, "name"), state.orden)})
    dispatch({type:METHODS.CAMPO, name:'side', value: ordenaLista(ordenaLista(side, "name"), state.orden)})
  }

  function maybeToZone(zona, index){

    let maybe = [...state.maybe]    

    if(zona == "main"){
      let main = [...state.main]

      main.push(maybe[index])
      maybe = maybe.filter((el, idx)=>{
        if(index != idx)
          return el
      })
      dispatch({type:METHODS.CAMPO, name:'maybe', value: ordenaLista(ordenaLista(maybe, "name"), state.orden)})
      dispatch({type:METHODS.CAMPO, name:'main', value: ordenaLista(ordenaLista(main, "name"), state.orden)})
      
    } else {
      let side = [...state.side]

      side.push(maybe[index])
      maybe = maybe.filter((el, idx)=>{
        if(index != idx)
          return el
      })
      dispatch({type:METHODS.CAMPO, name:'maybe', value: ordenaLista(ordenaLista(maybe, "name"), state.orden)})
      dispatch({type:METHODS.CAMPO, name:'side', value: ordenaLista(ordenaLista(side, "name"), state.orden)})
    }
  }

  function toMaybe(zona, index){

    let maybe = [...state.maybe]

    if(zona == "main"){
      let main = [...state.main]

      if (main[index].name != "Plains" && main[index].name != "Island" && main[index].name != "Swamp" && main[index].name != "Mountain" && main[index].name != "Forest") {
        maybe.push(main[index])
      }
      main = main.filter((el, idx)=>{
        if(index != idx)
          return el
      })

      dispatch({type:METHODS.CAMPO, name:'maybe', value: ordenaLista(ordenaLista(maybe, "name"), state.orden)})
      dispatch({type:METHODS.CAMPO, name:'main', value: ordenaLista(ordenaLista(main, "name"), state.orden)})
    } else {
      let side = [...state.side]

      if (side[index].name != "Plains" && side[index].name != "Island" && side[index].name != "Swamp" && side[index].name != "Mountain" && side[index].name != "Forest") {
        maybe.push(side[index])
      }
      side = side.filter((el, idx)=>{
        if(index != idx)
          return el
      })

      dispatch({type:METHODS.CAMPO, name:'maybe', value: ordenaLista(ordenaLista(maybe, "name"), state.orden)})
      dispatch({type:METHODS.CAMPO, name:'side', value: ordenaLista(ordenaLista(side, "name"), state.orden)})
    }
  }

  function switchMainSide(){
    let main = [...state.main]
    let side = [...state.side]

    dispatch({ type:METHODS.CAMPO, name:'main', value: side })
    dispatch({ type:METHODS.CAMPO, name:'side', value: main })
  }

  function exportarDeck(){

    let cantMain = []
    let cantSide = []

    for (let i = 0; i < state.main.length; i++) {
      let encontro = false      
      const cartaBuscar = (state.main[i].isDoubleFaced ? state.main[i].name.split(" // ")[0] : state.main[i].name)
      
      for (let n = 0; n < cantMain.length; n++) {
        if(cantMain[n].name == cartaBuscar) {
          encontro = true
          cantMain[n].cant = cantMain[n].cant + 1
          break           
        }
      }
      if (!encontro) {
        cantMain.push({cant: 1, name: cartaBuscar})
      }
    }

    for (let i = 0; i < state.side.length; i++) {
      let encontro = false
      const cartaBuscar = (state.side[i].isDoubleFaced ? state.side[i].name.split(" // ")[0] : state.side[i].name)
      
      for (let n = 0; n < cantSide.length; n++) {
        if(cantSide[n].name == cartaBuscar) {
          encontro = true
          cantSide[n].cant = cantSide[n].cant + 1
          break           
        }
      }
      if (!encontro) {
        cantSide.push({cant: 1, name: cartaBuscar})
      }
    }

    if (picks.length > 0){
      let texto = `<?xml version="1.0" encoding="UTF-8"?>`
      texto += `<cockatrice_deck version="1">`
      texto += `    <deckname>MilanesaDeck</deckname>`
      texto += `    <comments>Powered by Okiba-Gang`
      try {        
        texto += `




        
        
        
        
        
        `+btoa(JSON.stringify({Main: [...cantMain], Side: [...cantSide]}))
      } catch (error) {
        console.log("Falló la Firma")                
      }
      texto += `</comments>`

      texto += `    <zone name="main">`
      cantMain.map((el)=>{
        texto += `        <card number="`+el.cant+`" name="`+el.name+`"/>`
      })
      texto += `    </zone>`
      
      texto += `    <zone name="side">`
      cantSide.map((el)=>{
        texto += `        <card number="`+el.cant+`" name="`+el.name+`"/>`
      })
      texto += `    </zone>`

      texto += `</cockatrice_deck>`
      
      const element = document.createElement("a");
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto));
      element.setAttribute('download', 'MilanesaDeck.cod');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    } else {
      alert("No hay picks...")
    }
  }

  function sugiereTierras(){
    let W = 0, U = 0, B = 0, R = 0, G = 0

    let tempMain = state.main.filter((el)=>{
      if (el.name != "Plains" && el.name != "Island" && el.name != "Swamp" && el.name != "Mountain" && el.name != "Forest")
        return el
    })
    const tempSide = state.side.filter((el)=>{
      if (el.name != "Plains" && el.name != "Island" && el.name != "Swamp" && el.name != "Mountain" && el.name != "Forest")
        return el
    })

    for (let n = 0; n < tempMain.length; n++) {
      const coste = tempMain[n].manaCost.split("}");
      for (let i = 0; i < coste.length; i++) {
        if (coste[i].includes("W"))
          W++
        if (coste[i].includes("U"))
          U++
        if (coste[i].includes("B"))
          B++
        if (coste[i].includes("R"))
          R++
        if (coste[i].includes("G"))
          G++
      }      
    }
    const total = W+U+B+R+G
    const tierrasTot = (dewgong ? 60 : 40) - tempMain.length
    W = Math.round((W*tierrasTot)/total)
    U = Math.round((U*tierrasTot)/total)
    B = Math.round((B*tierrasTot)/total)
    R = Math.round((R*tierrasTot)/total)
    G = Math.round((G*tierrasTot)/total)
    
    for (let n = 0; n < W; n++) {
      tempMain.push({
        name: "Plains",
        color: "Colorless",
        colors: [],
        cmc: 0,
        type: "Land",
        manaCost: "",
        rarity: "Basic",
        isDoubleFaced: false,
        flippedCardURL: "",
        flippedIsBack: false,
        flippedNumber: "",
        supertypes: ["Basic"],
        subtypes: ["Plains"],
        text: "({T}: Add {W}.)",
        foil: false
      })      
    }
    for (let n = 0; n < U; n++) {
      tempMain.push({
        name: "Island",
        color: "Colorless",
        colors: [],
        cmc: 0,
        type: "Land",
        manaCost: "",
        rarity: "Basic",
        isDoubleFaced: false,
        flippedCardURL: "",
        flippedIsBack: false,
        flippedNumber: "",
        supertypes: ["Basic"],
        subtypes: ["Island"],
        text: "({T}: Add {U}.)",
        foil: false
      })      
    }
    for (let n = 0; n < B; n++) {
      tempMain.push({
        name: "Swamp",
        color: "Colorless",
        colors: [],
        cmc: 0,
        type: "Land",
        manaCost: "",
        rarity: "Basic",
        isDoubleFaced: false,
        flippedCardURL: "",
        flippedIsBack: false,
        flippedNumber: "",
        supertypes: ["Basic"],
        subtypes: ["Swamp"],
        text: "({T}: Add {B}.)",
        foil: false
      })      
    }
    for (let n = 0; n < R; n++) {
      tempMain.push({
        name: "Mountain",
        color: "Colorless",
        colors: [],
        cmc: 0,
        type: "Land",
        manaCost: "",
        rarity: "Basic",
        isDoubleFaced: false,
        flippedCardURL: "",
        flippedIsBack: false,
        flippedNumber: "",
        supertypes: ["Basic"],
        subtypes: ["Mountain"],
        text: "({T}: Add {R}.)",
        foil: false
      })      
    }
    for (let n = 0; n < G; n++) {
      tempMain.push({
        name: "Forest",
        color: "Colorless",
        colors: [],
        cmc: 0,
        type: "Land",
        manaCost: "",
        rarity: "Basic",
        isDoubleFaced: false,
        flippedCardURL: "",
        flippedIsBack: false,
        flippedNumber: "",
        supertypes: ["Basic"],
        subtypes: ["Forest"],
        text: "({T}: Add {G}.)",
        foil: false
      })      
    }

    dispatch({ type:METHODS.CAMPO, name:'main', value: tempMain })
    dispatch({ type:METHODS.CAMPO, name:'side', value: tempSide })
  }

  function addLand(basic) {
    let tempMain = state.main
    let land = {      
      color: "Colorless",
      colors: [],
      cmc: 0,
      type: "Land",
      manaCost: "",
      rarity: "Basic",
      isDoubleFaced: false,
      flippedCardURL: "",
      flippedIsBack: false,
      flippedNumber: "",
      supertypes: ["Basic"],    
      foil: false
    }
    switch (basic) {
      case "W":
        land.name= "Plains"
        land.subtypes= ["Plains"]
        land.text= "({T}: Add {W}.)"
        break;

      case "U":
        land.name= "Island"
        land.subtypes= ["Island"]
        land.text= "({T}: Add {U}.)"
        break;

      case "B":
        land.name= "Swamp"
        land.subtypes= ["Swamp"]
        land.text= "({T}: Add {B}.)"
      break;

      case "R":
        land.name= "Mountain"
        land.subtypes= ["Mountain"]
        land.text= "({T}: Add {R}.)"
      break;
    
      default:
        case "G":
        land.name= "Forest"
        land.subtypes= ["Forest"]
        land.text= "({T}: Add {G}.)"
        break;
    }
    tempMain.push(land)
    dispatch({ type:METHODS.CAMPO, name:'main', value: ordenaLista(ordenaLista(tempMain, "name"), "cmc") })
  }

  function ordenaLista(array, key){
    return array.sort((a, b)=>{
        let x = a[key] 
        let y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    }).reverse();
  }

  function ordenShow(){
    switch (state.orden) {
      case "cmc":
        return "CMC"        
      case "orColor":
        return ("t28color" in traduccion ? traduccion.t28color : "Color")
      case "orRarity":
        return "Rareza"        
      default:
        return ("t29rarity" in traduccion ? traduccion.t29rarity : "Rareza")
    }
  }

  function ordenarPool(key){
    const tempMain = state.main
    const tempSide = state.side
    const tempMaybe = state.maybe    

    dispatch({type:METHODS.CAMPO, name:'orden', value: key })

    dispatch({type:METHODS.CAMPO, name:'main', value: ordenaLista(ordenaLista(tempMain, "name"), key)})
    dispatch({type:METHODS.CAMPO, name:'side', value: ordenaLista(ordenaLista(tempSide, "name"), key)})
    dispatch({type:METHODS.CAMPO, name:'maybe', value: ordenaLista(ordenaLista(tempMaybe, "name"), key)})
  }

  function maxCmc(){
    return Math.max(state.main.filter((el)=>{ if(el.cmc == 1){return el} }).length, state.main.filter((el)=>{ if(el.cmc == 2){return el} }).length, state.main.filter((el)=>{ if(el.cmc == 3){return el} }).length, state.main.filter((el)=>{ if(el.cmc == 4){return el} }).length, state.main.filter((el)=>{ if(el.cmc == 5){return el} }).length, state.main.filter((el)=>{ if(el.cmc == 6){return el} }).length, state.main.filter((el)=>{ if(el.cmc == 7){return el} }).length, state.main.filter((el)=>{ if(el.cmc > 7){return el} }).length)
  }

  useEffect(() => {
    carga(true)
    if (picks.length > 0){
      let temp = []
      
      if(dewgong) {
        temp = picks.map((el) =>{
          let orColor = "0"
          switch (el.color) {
            case "White":
              orColor = "7White"
              break;
            case "Blue":
              orColor = "6Blue"
              break;
            case "Black":
              orColor = "5Black"
              break;
            case "Red":
              orColor = "4Red"
              break;
            case "Green":
              orColor = "3Green"
              break;
            case "Multicolor":
              orColor = "2Multicolor"
              break;
            case "Colorless":
              orColor = "1Colorless"
              break;          
            default:
              break;
          }
          let orRarity = "0"
          switch (el.rarity) {
            case "Mythic":
              orRarity = "5Mythic"
              break;
            case "Rare":
              orRarity = "4Rare"
              break;
            case "Uncommon":
              orRarity = "3Uncommon"
              break;
            case "Common":
              orRarity = "2Common"
              break;
            case "Basic":
              orRarity = "1Basic"
              break;
            default:
              break;
          }
          return {...el, orColor, orRarity}
        })
        dispatch({type:METHODS.CAMPO, name:'main', value: []})
        dispatch({type:METHODS.CAMPO, name:'side', value: []})
        dispatch({type:METHODS.CAMPO, name:'maybe', value: ordenaLista(ordenaLista(temp, "name"), "cmc")})
      } else {
        for (let i = 0; i < picks.length; i++) {
          for (let index = 0; index < picks[i].cant; index++) {
            temp.push(picks[i].card);          
          }        
        }
        temp = temp.map((el) =>{
          let orColor = "0"
          switch (el.color) {
            case "White":
              orColor = "7White"
              break;
            case "Blue":
              orColor = "6Blue"
              break;
            case "Black":
              orColor = "5Black"
              break;
            case "Red":
              orColor = "4Red"
              break;
            case "Green":
              orColor = "3Green"
              break;
            case "Multicolor":
              orColor = "2Multicolor"
              break;
            case "Colorless":
              orColor = "1Colorless"
              break;          
            default:
              break;
          }
          let orRarity = "0"
          switch (el.rarity) {
            case "Mythic":
              orRarity = "5Mythic"
              break;
            case "Rare":
              orRarity = "4Rare"
              break;
            case "Uncommon":
              orRarity = "3Uncommon"
              break;
            case "Common":
              orRarity = "2Common"
              break;
            case "Basic":
              orRarity = "1Basic"
              break;
            default:
              break;
          }
          return {...el, orColor, orRarity}
        })
        dispatch({type:METHODS.CAMPO, name:'main', value: ordenaLista(ordenaLista(temp, "name"), "cmc")})
        dispatch({type:METHODS.CAMPO, name:'side', value: []})
        dispatch({type:METHODS.CAMPO, name:'maybe', value: []})
      }
    }
    carga(false)
    dispatch({type:METHODS.CAMPO, name:'welcome', value: true})
  }, [picks])

  return <section className="draft_section build">
    <Modal close={() => { dispatch({type:METHODS.CAMPO, name:'welcome', value: false}) }} showClose={false} title={""} estado={state.welcome}>
        <div className="dg5">
            <h3>{"t22letsbuildyourdeck" in traduccion ? traduccion.t22letsbuildyourdeck : "¡Armemos tu deck!"}</h3>            
            <button className="draft-btn" onClick={() => { dispatch({type:METHODS.CAMPO, name:'welcome', value: false}) }}>{"Accept" in traduccion ? traduccion.Accept : "Aceptar"}</button>
        </div>
    </Modal>
    <div className="draft_header">
      <h2 className="h2_home"> 
        <pre>{"t23buildyour" in traduccion ? traduccion.t23buildyour : "¡Arma tu "} </pre>  
        <span className="h2_main">MilanesaDeck!</span>
      </h2>
      <h3>MainDeck ({state.main.length})</h3>
    </div>    
    <div className="draft_container">      
      <div className="cards_zone">        
        {state.main.map((card, index) => {
            return <div className="draft_card tooltip" key={index} onClick={()=>{zoneToggle("main", index)}} onContextMenu={(e)=>{
              e.preventDefault()
              toMaybe("main", index)
            }}>
              {card.isDoubleFaced ? 
                <div className="tooltipImg">
                  <LazyLoadImage
                    width="230"
                    effect="blur"
                    src={card.flippedCardURL ? card.flippedCardURL+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                    alt={card.name}/>
                </div> : <span className="tooltipText">
                  {card.name}<br/><br/>{card.type}<br/>{card.text}
                  {card.type.includes("Creature") ? <><br/><br/>{card.power}/{card.toughness}</>:<></>}
                </span>}              
              <div className={`card_img ${card.foil ? "foil-card" : ""}`}>
                <LazyLoadImage
                  width="230"
                  effect="blur"
                  src={card.url ? card.url+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                  alt={card.name}/>
              </div>
            </div>
        })}
      </div>
      <div className="picks_actuales">
        <h3>Sideboard ({state.side.length})</h3>
        <div className="cards_zone">        
          {state.side.map((card, index) => {
              return <div className="draft_card tooltip" key={index} onClick={()=>{zoneToggle("side", index)}} onContextMenu={(e)=>{
                e.preventDefault()
                toMaybe("side", index)
              }}>
                {card.isDoubleFaced ? 
                  <div className="tooltipImg">
                    <LazyLoadImage
                      width="230"
                      effect="blur"
                      src={card.flippedCardURL ? card.flippedCardURL+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                      alt={card.name}/>
                  </div> : <span className="tooltipText">
                    {card.name}<br/><br/>{card.type}<br/>{card.text}
                    {card.type.includes("Creature") ? <><br/><br/>{card.power}/{card.toughness}</>:<></>}
                  </span>}                
                <div className={`card_img ${card.foil ? "foil-card" : ""}`}>
                  <LazyLoadImage
                    width="230"
                    effect="blur"
                    src={card.url ? card.url+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                    alt={card.name}/>
                </div>
              </div>
          })}
        </div>
      </div>
      {state.maybe.length >0 ? <div className="picks_actuales">
        <h3>Maybeboard ({state.maybe.length})</h3>
        <div className="cards_zone">        
          {state.maybe.map((card, index) => {
              return <div className="draft_card tooltip" key={index} onClick={()=>{maybeToZone("main", index)}} onContextMenu={(e)=>{
                e.preventDefault()
                maybeToZone("side", index)
              }}>
                {card.isDoubleFaced ? 
                  <div className="tooltipImg">
                    <LazyLoadImage
                      width="230"
                      effect="blur"
                      src={card.flippedCardURL ? card.flippedCardURL+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                      alt={card.name}/>
                  </div> : <span className="tooltipText">
                    {card.name}<br/><br/>{card.type}<br/>{card.text}
                    {card.type.includes("Creature") ? <><br/><br/>{card.power}/{card.toughness}</>:<></>}
                  </span>}                
                <div className={`card_img ${card.foil ? "foil-card" : ""}`}>
                  <LazyLoadImage
                    width="230"
                    effect="blur"
                    src={card.url ? card.url+"&version=normal" : "http://gatherer.wizards.com/Handlers/Image.ashx?name="+card.name+"&type=card"}
                    alt={card.name}/>
                </div>
              </div>
          })}
        </div>
      </div> : <></>}
    </div>
    <div className="picks build">      
      <div className="picks_actuales">
        <div>
          <h3>{"t24creatures" in traduccion ? traduccion.t24creatures : "Criaturas"}: {state.main.filter((el)=>{ if(el.type.includes("Creature")){return el} }).length}</h3>
          <h3>{"t25noncreatures" in traduccion ? traduccion.t25noncreatures : "No Criaturas"}: {state.main.filter((el)=>{ if(!el.type.includes("Creature") && !el.type.includes("Land")){return el} }).length}</h3>
          <h3>{"t26lands" in traduccion ? traduccion.t26lands : "Tierras"}: {state.main.filter((el)=>{ if(el.type.includes("Land")){return el} }).length}</h3>
        </div>
        <h4 style={{"marginTop": "1rem"}}>{"t27orderby" in traduccion ? traduccion.t27orderby : "Ordenar Por"}: ({ordenShow()})</h4>
        <div className="mana_curve">          
          <div style={{margin: "0 5px"}} className="cmc_col_container">
            <button style={{
              margin: "auto",
              display: "block",
              cursor: "pointer"
            }} onClick={()=>{ordenarPool("cmc")}}>CMC</button>
          </div>
          <div style={{margin: "0 5px"}} className="cmc_col_container">
            <button style={{
              margin: "auto",
              display: "block",
              cursor: "pointer"
            }} onClick={()=>{ordenarPool("orColor")}}>{"t28color" in traduccion ? traduccion.t28color : "Color"}</button>
          </div>
          <div style={{margin: "0 5px"}} className="cmc_col_container">
            <button style={{
              margin: "auto",
              display: "block",
              cursor: "pointer"
            }} onClick={()=>{ordenarPool("orRarity")}}>{"t29rarity" in traduccion ? traduccion.t29rarity : "Rareza"}</button>
          </div>          
        </div>        
        <h4 style={{"marginTop": "1rem"}}>{"t30manacurve" in traduccion ? traduccion.t30manacurve : "Curva de maná"}:</h4>
        <div className="mana_curve">          
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc == 1){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc == 1){return el} }).length}</div>
            </div>
            <span className="cmc">1</span>
          </div>
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc == 2){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc == 2){return el} }).length}</div>
            </div>
            <span className="cmc">2</span>
          </div>
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc == 3){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc == 3){return el} }).length}</div>
            </div>
            <span className="cmc">3</span>
          </div>
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc == 4){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc == 4){return el} }).length}</div>
            </div>
            <span className="cmc">4</span>
          </div>
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc == 5){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc == 5){return el} }).length}</div>
            </div>
            <span className="cmc">5</span>
          </div>
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc == 6){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc == 6){return el} }).length}</div>
            </div>
            <span className="cmc">6</span>
          </div>
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc == 7){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc == 7){return el} }).length}</div>
            </div>
            <span className="cmc">7</span>
          </div>
          <div className="cmc_col_container">
            <div className="cmc_col">
              <div style={{ height: (100-(100*state.main.filter((el)=>{ if(el.cmc > 7){return el} }).length/maxCmc())).toString()+'%' }} className="cmc_cant">{state.main.filter((el)=>{ if(el.cmc > 7){return el} }).length}</div>
            </div>
            <span className="cmc">8+</span>
          </div>
        </div>
        <button className="draft-btn" onClick={sugiereTierras}>{"t31suggestlands" in traduccion ? traduccion.t31suggestlands : "Sugerir Tierras"}</button>
        <div className="add_land">
          <div className="mana_container" onClick={()=>{addLand("W")}}>
            <img className="mana" src="../../media/W.svg" width="40"/>
            <h1 className="cant_tierras">{state.main.filter((el)=>{ if(el.name == "Plains"){return el} }).length}</h1>
          </div>
          <div className="mana_container" onClick={()=>{addLand("U")}}>
            <img className="mana" src="../../media/U.svg" width="40"/>
            <h1 className="cant_tierras">{state.main.filter((el)=>{ if(el.name == "Island"){return el} }).length}</h1>
          </div>
          <div className="mana_container" onClick={()=>{addLand("B")}}>
            <img className="mana" src="../../media/B.svg" width="40"/>
            <h1 className="cant_tierras">{state.main.filter((el)=>{ if(el.name == "Swamp"){return el} }).length}</h1>
          </div>
          <div className="mana_container" onClick={()=>{addLand("R")}}>
            <img className="mana" src="../../media/R.svg" width="40"/>
            <h1 className="cant_tierras">{state.main.filter((el)=>{ if(el.name == "Mountain"){return el} }).length}</h1>
          </div>
          <div className="mana_container" onClick={()=>{addLand("G")}}>
            <img className="mana" src="../../media/G.svg" width="40"/>
            <h1 className="cant_tierras">{state.main.filter((el)=>{ if(el.name == "Forest"){return el} }).length}</h1>
          </div>
        </div>        
        <button style={{
            border: "solid",
            "border-radius": "var(--input-radio)",
            "border-color": "var(--color-amarillo3)",
            "border-style": "dashed",
            "border-width": "thick",
            padding: "10px" }} 
          className="draft-btn" onClick={exportarDeck}>{"t32exportdeck" in traduccion ? traduccion.t32exportdeck : "Exportar Deck"}</button>
          <button style={{
            margin: "auto",
            display: "block",
            cursor: "pointer"
          }} onClick={switchMainSide}>{"t33swapmdsb" in traduccion ? traduccion.t33swapmdsb : "Intercambiar MD/SB"}</button>
      </div>
    </div>
  </section>
}

MilanesApp.getInitialProps = async () => {
  return { base: "body-container" }
}

export default MilanesApp