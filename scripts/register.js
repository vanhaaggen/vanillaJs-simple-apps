const reglogModelCtrl = (() => {
    class User {
        constructor(id, name, surname, email, password) {
            this.id = id
            this.name = name
            this.surname = surname
            this.email = email
            this.password = password
        }

        sStorage() {
            sessionStorage.setItem(`${this.email}`, JSON.stringify(this))
        }

    }

    let localData = {
        countID: 0
    }

    let error = []

    return {

        getUserData: () => {
            return userData
        },
        getLocalData: () => {
            return localData
        },

        getError: () => {
            return error
        },

        clearError: () => error.length = 0,

        validate: () => {
            const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return {
                string: (target, name) => {
                    if (!target.trim()) error.push({
                        target: name,
                        message: 'field is empty or blank'
                    })
                },
                email: (target, name) => {
                    if (target.trim() && !EMAIL_REGEX.test(target)) error.push({
                        target: name,
                        message: 'Not a valid email format'
                    })
                },
                exist: (target, name) => {
                    if (sessionStorage.getItem(target)) error.push({
                        target: name,
                        message: 'User already exists'
                    })
                },
                password: (target, email, name) => {
                    let isUser = sessionStorage.getItem(email)
                    if (isUser) {
                        if (target.trim() && target !== JSON.parse(sessionStorage.getItem(email)).password) error.push({
                            target: name,
                            message: 'Wrong credentials'
                        })
                    }
                }
            }
        },
        firstNameSurnameCharachter: (name, surname) => {
            let nameFirstChar = name.substring(0, 1).toUpperCase()
            let surnameFirstChar = surname.substring(0, 1).toUpperCase()
            return `${nameFirstChar}${surnameFirstChar}`
        },

        addToSStorage: (obj) => {
            const { name, surname, email, password } = obj || {}

            localData.countID++
            let id = localData.countID

            let user = new User(id, name, surname, email, password)
            user.sStorage()
        }
    }
})()

const reglogUICtrl = ((reglogMCtrl) => {
    const DOM_STRG = {
        init: 'init',
        register: 'signup',
        name: 'name',
        surname: 'surname',
        email: 'email',
        password: 'password',
        form: '.reglog-form',
        login: 'login',
        confirm: 'confirm',
        app: '.app-reglog',
        user: 'user',
        error: 'error'

    }

    return {
        handleRegisterData: function () {
            let element = (id) => document.getElementById(id)
            let name = element(DOM_STRG.name).value
            let surname = element(DOM_STRG.surname).value
            let email = element(DOM_STRG.email).value
            let password = element(DOM_STRG.password).value

            let validate = reglogMCtrl.validate()
            validate.string(name, 'name')
            validate.string(surname, 'surname')
            validate.email(email, 'email')
            validate.string(email, 'email')
            validate.exist(email, 'email')
            validate.string(password, 'password')

            console.log('handleRegister')
            let isError = this.handleError()
            if (!isError) {
                return {
                    name: name,
                    surname: surname,
                    email: email,
                    password: password
                }
            } else {
                return
            }

        },

        handleLoginData: function () {
            let element = (id) => document.getElementById(id)
            let email = element(DOM_STRG.email).value
            let password = element(DOM_STRG.password).value

            let validate = reglogMCtrl.validate()
            validate.string(email, 'email')
            validate.string(password, 'password')
            validate.email(email, 'email')
            validate.password(password, email, 'password')

            let isError = this.handleError()
            if (!isError) {
                let data = JSON.parse(sessionStorage.getItem(email))
                console.log(data)
                return data
            } else {
                return
            }

        },

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

        handleError: () => {
            let error = reglogMCtrl.getError()
            let spanEl = document.getElementsByClassName(DOM_STRG.error)

            for (let i = 0; i < spanEl.length; i++) {
                spanEl[i].innerText = ""
                document.getElementsByClassName('reglog-input')[i].classList.remove('reglog-input-error')
            }

            if (error.length > 0) {
                for (let i = 0; i < spanEl.length; i++) {
                    for (let j = 0; j < error.length; j++) {
                        if (spanEl[i].classList[1] === `err-${error[j].target}`) {
                            let content = document.createTextNode(error[j].message)
                            spanEl[i].appendChild(content)
                            document.getElementById(error[j].target).classList.add('reglog-input-error')
                        }
                    }
                }
                reglogMCtrl.clearError()
                return true
            } else {
                return false
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

        userinterface: (obj) => {
            let parent = document.querySelector('.ctnr-user')
            let html = `
                <div class="reglog-ppic">
                    ${reglogMCtrl.firstNameSurnameCharachter(obj.name, obj.surname)}    
                </div>
                <div class="reglog-greeting">
                    <h3>Hi ${obj.name},</h3>
                    <p>great to see you again</p>
                </div>
                <ul>
                   <li>name: ${obj.name}</li>
                   <li>surname: ${obj.surname}</li>
                   <li>email: ${obj.email}</li>
                   <li>password: ${obj.password}</li>
                </ul>
                <div class="go-back">
                    <div class="back">
                        <div id="log-back" class="back-icon">
                            <ion-icon name="close-sharp"></ion-icon>
                            logout
                        </div>
                    </div>
                </div>
            `
            parent.insertAdjacentHTML('beforeend', html)
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
})(reglogModelCtrl)

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
                const data = reglogUICtrl.handleRegisterData()
                if (data) {
                    reglogModelCtrl.addToSStorage(data)
                    reglogUICtrl.display(DOMstrg.confirm)
                }
                break
            case 'confirm-login':
                reglogUICtrl.display(DOMstrg.login)
                break
            case 'submit-login':
                const user = reglogUICtrl.handleLoginData()
                if (user) {
                    reglogUICtrl.display(DOMstrg.user)
                    reglogUICtrl.userinterface(user)
                }
                break
            case 'log-back':
            case 'reg-back':
                reglogUICtrl.display(DOMstrg.init)
                break
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