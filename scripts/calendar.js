define(() => {
    const loadView = () => {
        const html = `<h1>Calendar Booking App</h1>`
        const hydrate = document.getElementById('root').insertAdjacentHTML("beforeend", html)
        return hydrate
    }
    return {
        init: () => {
            document.getElementById('root').innerHTML = ""
            loadView()
        },
    }
})