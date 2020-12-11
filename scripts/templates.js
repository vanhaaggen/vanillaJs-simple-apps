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
        <template id="init">
            <div class="init-choose">
                <div>Don't think twice</div>
                <button type="button" id="init-register" class="reglog-btn register-btn">REGISTER</button>
                <div>--- Already have an account? ---</div>
                <button type="button" id="init-login" class="reglog-btn login-btn login-btn--margin">LOGIN</button>
            </div>
        </template>
        <template id="signup">
            <div class="ctnr-register">
                <h3>Create your account</h3>
                <form class="reglog-form" id="register">
                    <label class="reglog-label" for="name">First name*<span class="error err-name"></span></label>
                    <input class="reglog-input" type="text" name="name" id="name" required>
                    <label class="reglog-label" for="surname">Last name*<span class="error err-surname"></span></label>
                    <input class="reglog-input" type="text" name="surname" id="surname" required>
                    <label class="reglog-label" for="email">E-mail*<span class="error err-email"></span></label>
                    <input class="reglog-input" type="email" name="email" id="email" required>
                    <label class="reglog-label" for="password">Password*<span class="error err-password"></span></label>
                    <input class="reglog-input" type="password" name="password" id="password" required>
                   
                    </form>
                    <div class="ctnr-reglog-btn">
                        <button type="button" id="submit-register" class="reglog-btn register-btn">REGISTER</button>
                    </div>
                    <div class="go-back"> 
                        <div class="back">
                            <div id="reg-back" class="back-icon">
                                <ion-icon name="chevron-back-outline"></ion-icon>
                                back
                            </div>
                        </div>
                    </div>
            </div>
        </template>
        <template id="confirm">
            <div class="ctnr-confirm ">
                <div>
                    <p>You have succesfully registered, please <a id="confirm-login" class="reglog-anchor">login</a></p>
                </div>
            </div>
        </template>
        <template id="login">
            <div class="ctnr-login">
                <h3>Nice to see you again</h3>
                <form class="reglog-form" id="login">
                    <label class="reglog-label" for="email">E-mail <span class="error err-email"></label>
                    <input class="reglog-input" type="email" name="email" id="email">
                    <label class="reglog-label" for="password">Password <span class="error err-password"></label>
                    <input class="reglog-input" type="password" name="password" id="password">
                    </form>
                    <div class="ctnr-reglog-btn">
                        <button type="button" id="submit-login" class="reglog-btn login-btn">LOGIN</button>
                    </div>
                    <div class="go-back">
                        <div class="back">
                            <div id="log-back" class="back-icon">
                                <ion-icon name="chevron-back-outline"></ion-icon>
                                back
                            </div>
                        </div>
                    </div>
            </div>
        </template>

        <div class="app-reglog"></div>

        ${github('register')}
        `,


        card: `
        <h1>Credit Card App</h1>
        ${github('card')}
        `,

        calendar: `
        <h1>Calendar Booking App</h1>
        
        <p class="calendar__top-p-element">Select your dates:</p>

        <div class="search-container">
            <form class="search sb">
                <input id="select" class="sb-container" type="text" placeholder="Check-in / Check-out" readonly value>

                <select name="NumberOfPeople" class="sb-select" id="search-box">
                    <option>1</option>
                    <option selected="selected">2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
                <button id="btn-submit" class="booking-btn">Book</button>
            </form>
        </div>

        <div class="calendar calendar-none" >
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

            <table id="dates">
                <thead>
                    <tr id="thtr"></tr>
                </thead>
                <tbody id="tb"></tbody>
            </table> 

        </div>

        <div id="result"></div>
      

        ${github('calendar')}
`
    }

    return {
        getTemplate: name => template[`${name}`]

    }
})