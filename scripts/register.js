const reglogModelCtrl = (() => {
    class User {
        constructor(name, surname, email, password) {
            this.id = this.generateId()
            this.name = name
            this.surname = surname
            this.email = email
            this.password = password
        }

        generateId() {
            return Math.floor(Math.random() * 1000000)
        }
    }
    const userData = {
        test: 'HI'
    }
    return {

        getUserData: () => {
            return userData
        },

        testUserClass: (name, surname, email, password) => {
            let user = new User(name, surname, email, password)
            return user
        }
    }
})()

const reglogUICtrl = (() => {
    const DOM_STRG = {
        init: 'init',
        register: 'signup',
        login: 'login',
        confirm: 'confirm',
        app: '.app-reglog'
    }

    return {
        loadView: view => {
            const hydrate = document.getElementById('root').insertAdjacentHTML("beforeend", view)
            return hydrate
        },

        display: function (element) {
            let querySelector = this.getChildClassname() && `.${this.getChildClassname()}`

            if (querySelector) {
                this.unmountTemplate(querySelector)
                this.mountTemplate(element)
            }
        },

        getChildClassname: () => {
            const app = document.querySelector(DOM_STRG.app)
            let classname
            for (let i = 0; i < app.childNodes.length; i++) {
                app.childNodes[i].childNodes.length > 0 ?
                    classname = app.childNodes[i].className :
                    null
            }
            return classname
        },

        mountTemplate: element => {
            const el = document.getElementById(element)
            const clone = document.importNode(el.content, true)
            document.querySelector(DOM_STRG.app).appendChild(clone)
        },

        unmountTemplate: querySelect => {
            document.querySelector(querySelect).remove()
        },

        getDomStrg: () => {
            return DOM_STRG
        }

    }
})()

define(() => {
    const DOMstrg = reglogUICtrl.getDomStrg()

    const eventCtrl = (e) => {
        let id = e.target.id
        switch (id) {
            case 'init-register':
                reglogUICtrl.display(DOMstrg.register)
                break
            case 'init-login':
                reglogUICtrl.display(DOMstrg.login)
                break
            case 'submit-register':
                reglogUICtrl.display(DOMstrg.confirm)
                break
            case 'confirm-login':
                reglogUICtrl.display(DOMstrg.login)
                break
            case 'submit-login':
                alert('welcome to your account!')
        }
    }

    const setupEventListeners = () => {

        document.querySelector(DOMstrg.app).addEventListener('click', (e) => {
            eventCtrl(e)
        }, false)
    }

    return {
        init: (view) => {
            document.getElementById('root').innerHTML = ""
            reglogUICtrl.loadView(view)
            reglogUICtrl.mountTemplate(DOMstrg.init)
            setupEventListeners()
        }
    }
})