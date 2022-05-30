export const fetchParams = (body, method = 'POST') => {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        method,
        body: JSON.stringify(body)
    }
}