define(() => {
    const github = (slug) => {
        return `
        <div class="github-link-container">
            <a class="github-link" 
                href="https://github.com/vanhaaggen/vanillaJs-simple-apps/blob/master/scripts/${slug}.js"
                target="_blank"
            > code is on github <span>&nbsp;</span> <ion-icon name="logo-github">ion-icon>
            </a>
        </div>
        `
    }

    const template = {
        todoapp: `
        <div class="input-container">
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
        ${github('todoapp')}
        `,


        register: `
        <h1>Register Form App</h1>
        ${github('register')}
        `,


        card: `
        <h1>Credit Card App</h1>
        ${github('card')}
        `,

        calendar: `
        <h1>Calendar Booking App</h1>

        <div class="calendar">
            <div class="calendar__info">
                <div class="calendar__prev btn-click-fx" id="prev-month">
                    <ion-icon class="calendar__nav-btn" name="caret-back-outline"></ion-icon>
                </div>
                <div class="calendar__month" id="month"></div>
                <div class="calendar__year" id="year"></div>
                <div class="calendar__next btn-click-fx" id="next-month">
                    <ion-icon class="calendar__nav-btn" name="caret-forward-outline"></ion-icon>
                </div>
            </div>

            <div class="calendar__week">
                <div class="calendar__item">Mon</div>
                <div class="calendar__item">Tue</div>
                <div class="calendar__item">Wed</div>
                <div class="calendar__item">Thu</div>
                <div class="calendar__item">Fri</div>
                <div class="calendar__item">Sat</div>
                <div class="calendar__item">Sun</div>
            </div>

            <div class="calendar__dates" id="dates"></div>

        </div>

        <div class="search-container">
            <div class="search">
                <form class="form">
                    <input class="search-box" type="text" name="Check-in" id="checkin" size="12" placeholder="Check-in" value>
                    <input class="search-box" type="text" name="Check-out" id="checkout" size="12" placeholder="Check-out" value>
                    <select name="NumberOfPeople" class="search-box" id="search-box">
                        <option>1</option>
                        <option selected="selected">2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                    <button id="btn-submit" class="booking-btn">Book</button>
                </form>
            </div>
        </div>

        <div id="result" class="result__container"></div>

        ${github('calendar')}
`
    }

    return {
        getTemplate: (templ) => {
            return template[`${templ}`]
        }
    }
})