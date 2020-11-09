const CALENDAR_HTML = `

<h1>Calendar Booking App</h1>
<div class="search-container">
    <div class="search">
        <form class="form">
            <input class="search-box" type="text" name="Llegada" id="form1" size="12" readonly="readonly"
                placeholder="Llegada" value>
            <input class="search-box" type="text" name="Salida" id="form1" size="12" readonly="readonly"
                placeholder="Salida" value>
            <select name="NumberOfPeople" class="search-box">
                <option>1</option>
                <option selected="selected">2</option>
                <option>3</option>
                <option>4</option>
            </select>
            <button class="booking-btn">Reservar</button>
        </form>
    </div>
</div>

<div class="calendar">
    <div class="calendar__info">
        <div class="calendar__prev" id="prev-month">&#9664;</div>
        <div class="calendar__month" id="month"></div>
        <div class="calendar__year" id="year"></div>
        <div class="calendar__next" id="next-month">&#9654;</div>
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
</div>`


const calendarCtrl = (() => {
    let now = new Date()

    const DATE = {
        day: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear(),
        currentMonth: now.getMonth(),
        currentYear: now.getFullYear(),
    }

    const data = {
        element: [],
        clicks: 0,
        checkIn: 0,
        checkOut: 0,
        totalDays: 0,
    }

    const isLeapYear = function () {
        return ((DATE.year % 100 !== 0) && (DATE.year % 4 === 0) || (DATE.year % 400 === 0))
    }

    return {

        firstOfMonth: function () {
            let dayOne = new Date(DATE.year, DATE.month, 1)
            return ((dayOne.getDay() - 1) === -1) ? 6 : dayOne.getDay() - 1
        },

        getTotalDays: function () {
            if (DATE.month === -1) DATE.month = 11

            if (DATE.month == 0 || DATE.month == 2 || DATE.month == 4 || DATE.month == 6 || DATE.month == 7 || DATE.month == 9 || DATE.month == 11) {
                return 31;

            } else if (DATE.month == 3 || DATE.month == 5 || DATE.month == 8 || DATE.month == 10) {
                return 30;

            } else {

                return isLeapYear() ? 29 : 28;
            }
        },

        prevMonth: function (callback) {
            if (DATE.month != 0) {
                DATE.month--
            } else {
                DATE.month = 11
                DATE.year--
            }
            callback()
        },

        nextMonth: function (callback) {
            if (DATE.month !== 11) {
                DATE.month++
            } else {
                DATE.month = 0
                DATE.year++
            }
            callback()
        },

        totalDaysBetweenDates: function (dateOne, dateTwo) {
            const date1 = new Date(`"${dateOne}"`)
            const date2 = new Date(`"${dateTwo}"`)

            const diffInTime = date2.getTime() - date1.getTime()
            const daysBetweenDates = diffInTime / (1000 * 3600 * 24)

            return Math.abs(daysBetweenDates)
        },

        getData: function () {
            return data
        },

        getDateObjects: function () {
            return DATE
        },

        getDateInicializer: function () {
            return now
        }

    }
})()


const calendarUICtrl = (calendCtrl => {
    const DATE = calendCtrl.getDateObjects()
    const data = calendCtrl.getData()

    const DOMstrings = {
        date: '#date',
        dates: "dates",
        month: "month",
        year: "year",
        prevMonth: "prev-month",
        nextMonth: 'next-month',
        root: 'root'
    }

    return {
        displayFullMonth: function () {
            let datesElement = document.getElementById(DOMstrings.dates)
            let firstOfMonth = calendCtrl.firstOfMonth(DATE.month, DATE.year)
            let totalMonthDays = calendCtrl.getTotalDays()

            for (let i = firstOfMonth; i > 0; i--) {
                let lastDays = (totalMonthDays - 1) - (i - 1)

                datesElement.innerHTML += ` <div class="calendar__date calendar__item calendar__last-days" id="date" data-month="${DATE.month - 1}" data-year="${DATE.year}">${lastDays}</div>`;
            }

            for (let i = 1; i <= totalMonthDays; i++) {
                if (i < DATE.day && DATE.currentMonth === DATE.month || DATE.month < DATE.currentMonth || DATE.year < DATE.currentYear) {
                    datesElement.innerHTML += ` <div class="calendar__date calendar__item calendar__last-days" id="date" data-month="${DATE.month}" data-year="${DATE.currentYear}">${i}</div>`;
                } else {
                    datesElement.innerHTML += ` <div class="calendar__date calendar__item calendar__following-days" id="date" data-month="${DATE.month}" data-year="${DATE.year}">${i}</iv>`;
                }
            }
        },

        displayMonthAndYear: function () {
            let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let monthElement = document.getElementById(DOMstrings.month)
            let yearElement = document.getElementById(DOMstrings.year)

            monthElement.textContent = monthNames[DATE.month]
            yearElement.textContent = DATE.year.toString()
        },


        selectDates: function (m, d, y, event) {

            data.clicks == 2 ? this.cleanDataObject(data) : data.clicks

            if (event === 'click' && data.clicks == 0) {
                data.checkIn = `${m + 1}/${d}/${y}`
                data.clicks++
            } else if (event === 'click' && data.clicks == 1) {
                data.checkOut = `${m + 1}/${d}/${y}`
                data.clicks++
                data.totalDays = calendarCtrl.totalDaysBetweenDates(data.checkIn, data.checkOut)
            }
            console.log(data)
        },


        cleanDataObject: function (obj) {
            let dateColor = document.querySelectorAll(DOMstrings.date)
            for (let val in obj) {
                if (obj.hasOwnProperty(val)) {
                    obj[val] = 0
                }
            }

            dateColor.forEach(el => el.classList.remove('state-active'))
        },

        loadView: () => {
            const root = document.getElementById(DOMstrings.root)
            const hydrate = root.insertAdjacentHTML("beforeend", CALENDAR_HTML)
            return hydrate
        },

        getDOMstrings: function () {
            return DOMstrings
        },

    }
})(calendarCtrl)


define(() => {
    const CALENDAR_DOM = calendarUICtrl.getDOMstrings();
    const DATE = calendarCtrl.getDateObjects()
    let now = calendarCtrl.getDateInicializer()

    const setNewDate = function () {
        now.setFullYear(DATE.year, DATE.month, DATE.day)
        calendarUICtrl.displayMonthAndYear()
        document.getElementById(CALENDAR_DOM.dates).textContent = ''
        calendarUICtrl.displayFullMonth()
    }

    const setupEventListeners = function () {
        const expression = (e) => {
            let day = e.target.innerText
            let month = e.target.dataset.month * 1
            let year = e.target.dataset.year
            if (DATE.day >= DATE.day && DATE.month === month || month > DATE.month || DATE.currentYear > DATE.year) {
                let elements = []
                elements.push(e.outerHTML)
                let doesElementExist = elements.indexOf(e.target)
                doesElementExist === -1 ? e.target.classList.add("state-active") : e.target.classList.remove("state-active")

                calendarUICtrl.selectDates(month, day, year, e.type)


                console.log(e.outerHTML)
            }
        }

        document.getElementById(CALENDAR_DOM.prevMonth).addEventListener('click', () => {
            calendarCtrl.prevMonth(setNewDate)

        })

        document.getElementById(CALENDAR_DOM.nextMonth).addEventListener('click', () => {
            calendarCtrl.nextMonth(setNewDate)

        })
        document.getElementById(CALENDAR_DOM.dates).addEventListener('click', expression, false)
        document.getElementById(CALENDAR_DOM.dates).addEventListener('mouseover', expression, false)
    }


    return {
        init: () => {
            document.getElementById('root').innerHTML = ""
            calendarUICtrl.loadView()
            calendarUICtrl.displayMonthAndYear()
            calendarUICtrl.displayFullMonth()
            setupEventListeners()
        }
    }
})

