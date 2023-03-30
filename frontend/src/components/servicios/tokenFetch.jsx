async function tokenFetch(url, body={}, method = 'GET', headers={}) {
    try {
        let headers_param = {
            "Content-Type": "application/json",
            //"Authorization": "Bearer " + token,
            ...headers
        }
        let header = {
            method: method,
            body: JSON.stringify({...body}),
            headers: {...headers_param}
        }
        if (method=='GET') {
            header={
                method: method,
                headers: {...headers_param}
            }
        }

        const response = await fetch(url, header)
        if (response.status===401) {
            throw "error";
        }
        if (response && response.status===403) {
            return undefined
        }
        return response
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
}

export { tokenFetch }
