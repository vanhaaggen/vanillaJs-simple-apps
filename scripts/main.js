
require([
    "todoapp",
    "register",
    "card",
    "calendar"], (todoApp, registerApp, cardApp, calendarApp) => {

        const DOM_STRINGS = {
            todo: 'todo',
            register: 'register',
            card: 'card',
            calendar: 'calendar'
        }

        document.getElementById(DOM_STRINGS.todo).addEventListener('click', () => todoApp.init())
        document.getElementById(DOM_STRINGS.register).addEventListener('click', () => registerApp.init())
        document.getElementById(DOM_STRINGS.card).addEventListener('click', () => cardApp.init())
        document.getElementById(DOM_STRINGS.calendar).addEventListener('click', () => calendarApp.init())

    })