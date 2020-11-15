
require([
    "templates",
    "todoapp",
    "register",
    "card",
    "calendar"], (view, todoApp, registerApp, cardApp, calendarApp) => {

        const DOM_STRINGS = {
            todo: 'todo',
            register: 'register',
            card: 'card',
            calendar: 'calendar'
        }
        const todoTemplate = view.getTemplate('todoapp')
        const registerTemplate = view.getTemplate('register')
        const cardTemplate = view.getTemplate('card')
        const calendarTemplate = view.getTemplate('calendar')


        document.getElementById(DOM_STRINGS.todo).addEventListener('click', () => todoApp.init(todoTemplate))
        document.getElementById(DOM_STRINGS.register).addEventListener('click', () => registerApp.init(registerTemplate))
        document.getElementById(DOM_STRINGS.card).addEventListener('click', () => cardApp.init(cardTemplate))
        document.getElementById(DOM_STRINGS.calendar).addEventListener('click', () => calendarApp.init(calendarTemplate))

    })