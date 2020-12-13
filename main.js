(function () {
    let open = false
    let query = open ? '.nav-ul-open' : '.nav-ul-closed'
    let el = document.querySelector(query)

    const toggle = (el) => {
        if (open) {
            el.classList.add('nav-ul-open')
            el.classList.remove('nav-ul-closed')
        } else {
            el.classList.add('nav-ul-closed')
            el.classList.remove('nav-ul-open')
        }
    }
    document.querySelector('.menu-icon').addEventListener('click', () => {
        open = !open
        toggle(el)
    })

    window.addEventListener('mouseup', (e) => {
        if (document.querySelector('.container-left-small-bottom').contains(e.target)) {
            open = !open
            toggle(el)
        }
    })
})()