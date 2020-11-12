const TODO_HTML = `<div class="input-container">
            <h1>Todo App</h1>
            <label for="task">Add your task</label>
            <div class="input-n-bttn">
                <input class="input__description" type="text" name="task" id="task">
                <div class="btn-todo input__bttn btn-click-fx">
                    <ion-icon class="ion-icon-add" name="add-sharp"></ion-icon>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="task__list">

                <div class="item" id="test">
                    <div class="item-top">
                        <div class="id">Example task</div>
                        <div class="task__date">07/11/2020 10:57</div>
                    </div>

                    <div class="item-bottom">
                        <div class="task__description">Do Homework</div>
                        <div>
                            <div class="btn-todo item__delete btn-click-fx">
                                <ion-icon class="ion-icon-close" name="close-sharp"></ion-icon>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="github-link-container">
            <a 
                class="github-link" 
                href="https://github.com/vanhaaggen/vanillaJs-simple-apps/blob/master/scripts/todoapp.js"
                target="_blank"
            > code is on github <span>&nbsp;</span> <ion-icon name="logo-github">ion-icon>
            </a>
        </div>`



const todoCtrl = (() => {
    const Task = function (id, description, date) {
        this.id = id
        this.description = description
        this.date = date
    }

    const data = {
        taskItems: []
    }

    return {
        addTask: des => {
            const date = new Date()
            let ID

            if (data.taskItems.length > 0) {
                ID = data.taskItems[data.taskItems.length - 1].id + 1
            } else {
                ID = 0
            }

            let creationDate = date.toLocaleString()

            let newTask = new Task(ID, des, creationDate)

            data.taskItems.push(newTask)

            return newTask
        },

        deleteTask: id => {
            const ids = data.taskItems.map(element => {
                return element.id
            })

            const index = ids.indexOf(id)

            if (index != -1) {
                data.taskItems.splice(index, 1)
            }
        },

        test: () => {
            console.log(data)
        }
    }
})()

const todoUICtrl = (() => {
    const DOM_STRINGS = {
        addDescription: ".input__description",
        addBttn: ".input__bttn",
        container: '.container',
        taskContainer: ".task__list",
        root: "root"
    }

    return {
        getInput: () => {
            return {
                description: document.querySelector(DOM_STRINGS.addDescription).value
            }
        },

        addListItem: obj => {
            const element = DOM_STRINGS.taskContainer
            const html = `
            <div class="item" id="${obj.id}"> 
                <div class="item-top">
                    <div class="id">${obj.id + 1}</div>
                    <div class="task__date">${obj.date}</div>
                </div>
                <div class="item-bottom">
                    <div class="task__description">${obj.description}</div>
                    <div class="btn-todo item__delete btn-click-fx">
                    <ion-icon class="ion-icon-close" name="close-sharp"></ion-icon>
                    </div>
                </div>
           </div>`

            document.querySelector(element).insertAdjacentHTML('beforeend', html)
        },

        deleteListItem: (selectorID) => {
            const el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },

        clearInputField: () => {
            const field = document.querySelector(DOM_STRINGS.addDescription)

            field.value = ""
        },

        loadView: () => {
            const root = document.getElementById(DOM_STRINGS.root)
            const hydrate = root.insertAdjacentHTML('beforeend', TODO_HTML)
            return hydrate
        },

        getDOMstrings: () => {
            return DOM_STRINGS
        }

    }
})()

define(() => {
    const DOM = todoUICtrl.getDOMstrings()
    const setupEventListener = () => {

        document.querySelector(DOM.addBttn).addEventListener('click', ctrlAddTask)

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteTask)

    }

    const ctrlAddTask = () => {
        let input = todoUICtrl.getInput()

        if (input.description !== "") {
            let newTask = todoCtrl.addTask(input.description)

            todoUICtrl.addListItem(newTask)

            todoUICtrl.clearInputField()
        }

    }

    const ctrlDeleteTask = event => {
        let ID
        const taskID = event.target.parentNode.parentNode.parentNode.id
        console.log(taskID)
        if (taskID) {
            ID = taskID * 1
            todoCtrl.deleteTask(ID)
            todoUICtrl.deleteListItem(taskID)
        }
    }

    return {
        init: () => {
            console.log('App has started.')
            document.getElementById(DOM.root).innerHTML = ""
            todoUICtrl.loadView()
            setupEventListener()
        }
    }
})
