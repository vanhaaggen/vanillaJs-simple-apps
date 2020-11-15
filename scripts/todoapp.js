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

        loadView: (view) => {
            const root = document.getElementById(DOM_STRINGS.root)
            const hydrate = root.insertAdjacentHTML('beforeend', view)
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
        init: (view) => {
            console.log('App has started.')
            document.getElementById(DOM.root).innerHTML = ""
            todoUICtrl.loadView(view)
            setupEventListener()
        }
    }
})
