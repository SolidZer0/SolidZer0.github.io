import { tokenFetch } from './tokenFetch'
import { URL } from './URL'

async function listar_sets() {
    try {
        const response = await (await tokenFetch(URL.LISTA_SETS, {})).json()
        return response
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return undefined
    }
}

async function generar_booster(expansion) {
    try {
        const response = await (await tokenFetch(URL.GENERA_BOOSTER + expansion+'/booster', {})).json()
        return response
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return undefined
    }
}

async function adquirir_idiomas() {
    const headers = {
        API_KEY: "3e00dfd3f00d36a5c8d27dc9885e6db0a298612f1d656a543a578a17fc174241",
    }
    try {
        const response = await tokenFetch(URL.ADQUIERE_IDIOMAS, {}, "GET", headers)
        let localization = undefined
        if (response && "ok" in response && response.ok)
            localization = await response.json()
        return localization
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return undefined
    }
}

async function adquirir_traducciones(idiomaId) {
    const headers = {
        API_KEY: "3e00dfd3f00d36a5c8d27dc9885e6db0a298612f1d656a543a578a17fc174241",
    }
    try {
        const response = await tokenFetch(URL.TRADUCE + '?language_id=' +idiomaId, {}, "GET", headers)
        let localization = undefined
        if (response && "ok" in response && response.ok)
            localization = await response.json()
        return localization
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        return undefined
    }
}

export { listar_sets, generar_booster, adquirir_idiomas, adquirir_traducciones }