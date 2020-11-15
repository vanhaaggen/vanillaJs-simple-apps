define(() => {
    const loadView = (view) => {
        const hydrate = document.getElementById('root').insertAdjacentHTML("beforeend", view)
        return hydrate
    }
    return {
        init: (view) => {
            document.getElementById('root').innerHTML = ""
            loadView(view)
        },
    }
})