
require([
    "templates",
    "todoapp",
    "register",
    "card",
    "calendar"], (view, todoApp, registerApp, cardApp, calendarApp) => {
        const todoTemplate = view.getTemplate('todoapp')
        const registerTemplate = view.getTemplate('register')
        const cardTemplate = view.getTemplate('card')
        const calendarTemplate = view.getTemplate('calendar')

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

        const eventDelegator = (id) => {
            switch (id) {
                case 'todo':
                case 'todo-mobile':
                    todoApp.init(todoTemplate)
                    break;
                case 'register':
                case 'register-mobile':
                    registerApp.init(registerTemplate)
                    break;
                case 'card':
                case 'card-mobile':
                    cardApp.init(cardTemplate)
                    break;
                case 'calendar':
                case 'calendar-mobile':
                    calendarApp.init(calendarTemplate)
                    break;
            }
        }


        document.querySelector('.menu-icon').addEventListener('click', () => {
            open = !open
            toggle(el)
        })

        window.addEventListener('mouseup', (e) => {
            if (document.querySelector('.container-left-small-bottom').contains(e.target)) {
                eventEmitter(e.target.id)
                open = !open
                toggle(el)
            }
        })

        document.querySelector('.app-nav').addEventListener('click', (e) => eventDelegator(e.target.id))

    })