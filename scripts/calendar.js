const CALENDAR_HTML = `
<h1>Calendar Booking App</h1>
<div class="search-container">
    <div class="search">
        <form class="form">
            <input class="search-box" type="text" name="Check-in" id="checkin" size="12" readonly="readonly"
                placeholder="Check-in" value>
            <input class="search-box" type="text" name="Check-out" id="checkout" size="12" readonly="readonly"
                placeholder="Check-out" value>
            <select name="NumberOfPeople" class="search-box">
                <option>1</option>
                <option selected="selected">2</option>
                <option>3</option>
                <option>4</option>
            </select>
            <button class="booking-btn">Book</button>
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

    const isLeapYear = () => ((DATE.year % 100 !== 0) && (DATE.year % 4 === 0) || (DATE.year % 400 === 0))

    return {

        firstOfMonth: () => {
            let dayOne = new Date(DATE.year, DATE.month, 1)
            return ((dayOne.getDay() - 1) === -1) ? 6 : dayOne.getDay() - 1
        },

        getTotalDays: () => {
            if (DATE.month === -1)
                DATE.month = 11

            if (DATE.month == 0 || DATE.month == 2 || DATE.month == 4 || DATE.month == 6 || DATE.month == 7 || DATE.month == 9 || DATE.month == 11) {
                return 31

            } else if (DATE.month == 3 || DATE.month == 5 || DATE.month == 8 || DATE.month == 10) {
                return 30

            } else {

                return isLeapYear() ? 29 : 28
            }
        },

        prevMonth: (callback) => {
            if (DATE.month != 0) {
                DATE.month--
            } else {
                DATE.month = 11
                DATE.year--
            }
            callback()
        },

        nextMonth: (callback) => {
            if (DATE.month !== 11) {
                DATE.month++
            } else {
                DATE.month = 0
                DATE.year++
            }
            callback()
        },

        totalDaysBetweenDates: (dateOne, dateTwo) => {
            const date1 = new Date(`"${dateOne}"`)
            const date2 = new Date(`"${dateTwo}"`)

            const diffInTime = date2.getTime() - date1.getTime()
            const daysBetweenDates = diffInTime / (1000 * 3600 * 24)

            return Math.abs(daysBetweenDates)
        },

        cleanDataObject: (obj) => {
            for (let val in obj) {
                if (obj.hasOwnProperty(val)) {
                    obj[val] = 0
                }
            }
        },

        getData: () => data,

        getDateObjects: () => DATE,

        getDateInicializer: () => now

    }
})()

const calendarUICtrl = (calendCtrl => {
    const DATE = calendCtrl.getDateObjects()
    const data = calendCtrl.getData()

    const DOMstrings = {
        date: '#date',
        dates: "dates",
        days: "days",
        month: "month",
        year: "year",
        prevMonth: "prev-month",
        nextMonth: 'next-month',
        checkinEl: 'checkin',
        checkoutEl: 'checkout',
        root: 'root'
    }

    return {
        displayFullMonth: () => {
            let datesElement = document.getElementById(DOMstrings.dates)
            let firstOfMonth = calendCtrl.firstOfMonth(DATE.month, DATE.year)
            let totalMonthDays = calendCtrl.getTotalDays()

            for (let i = firstOfMonth; i > 0; i--) {
                let lastDays = (totalMonthDays - 1) - (i - 1)

                datesElement.innerHTML += ` <div class="days calendar__date calendar__item calendar__last-days" id="date" data-month="${DATE.month - 1}" data-year="${DATE.year}">${lastDays}</div>`
            }

            for (let i = 1; i <= totalMonthDays; i++) {
                if (i < DATE.day && DATE.currentMonth === DATE.month || DATE.month < DATE.currentMonth || DATE.year < DATE.currentYear) {
                    datesElement.innerHTML += ` <div class="days calendar__date calendar__item calendar__last-days" id="date" data-month="${DATE.month}" data-year="${DATE.currentYear}">${i}</div>`
                } else {
                    datesElement.innerHTML += ` <div class="days calendar__date calendar__item calendar__following-days" id="date" data-month="${DATE.month}" data-year="${DATE.year}">${i}</iv>`
                }
            }
        },

        displayMonthAndYear: () => {
            let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let monthElement = document.getElementById(DOMstrings.month)
            let yearElement = document.getElementById(DOMstrings.year)

            monthElement.textContent = monthNames[DATE.month]
            yearElement.textContent = DATE.year.toString()
        },

        showCheckinCheckout: (elID, dataObj) => {
            document.getElementById(elID).value = dataObj
        },

        clearCheckinCheckout: () => {
            document.getElementById(DOMstrings.checkinEl).value = ''
            document.getElementById(DOMstrings.checkoutEl).value = ''
        },

        findIndexOfHTMLCollection: (HTMLCollection) => {
            let res = []
            Array.from(HTMLCollection).forEach((el, i) => el.classList.contains('active') ?
                res.push(i) : null)

            return res
        },

        datePickerLogic: function (e) {
            let element = document.getElementsByClassName(DOMstrings.days)

            if (e.target.parentElement.className === 'calendar__dates') {
                let isActive = e.target.classList.contains('active')

                if (!isActive) {
                    e.target.classList.add('active')
                } else {
                    e.target.classList.remove('active')
                }

                let idxOfHTMLColl = this.findIndexOfHTMLCollection(element)

                if (idxOfHTMLColl.length === 2) {
                    for (let i = idxOfHTMLColl[0] + 1; i < idxOfHTMLColl[1]; i++) {
                        element[i].classList.add('distance')
                    }

                } else if (data.clicks == 2 || idxOfHTMLColl.length >= 2) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].classList.remove('distance')
                        element[i].classList.remove('active')
                    }

                    e.target.classList.add('active')
                }
            }

        },

        selectDates: function (m, d, y) {
            data.clicks == 2 ? (calendCtrl.cleanDataObject(data),
                this.clearCheckinCheckout()) : data.clicks

            if (data.clicks == 0) {
                data.checkIn = `${m + 1}/${d}/${y}`
                data.clicks++
                this.showCheckinCheckout(DOMstrings.checkinEl, data.checkIn)
            } else if (data.clicks == 1) {
                data.checkOut = `${m + 1}/${d}/${y}`
                data.clicks++
                this.showCheckinCheckout(DOMstrings.checkoutEl, data.checkOut)
                data.totalDays = calendarCtrl.totalDaysBetweenDates(data.checkIn, data.checkOut)
            }

            console.log(data)
        },

        loadView: () => {
            const root = document.getElementById(DOMstrings.root)
            const hydrate = root.insertAdjacentHTML("beforeend", CALENDAR_HTML)
            return hydrate
        },

        getDOMstrings: () => DOMstrings,

    }
})(calendarCtrl)

define(() => {
    const CALENDAR_DOM = calendarUICtrl.getDOMstrings();
    const DATE = calendarCtrl.getDateObjects()
    let now = calendarCtrl.getDateInicializer()


    const setNewDate = () => {
        now.setFullYear(DATE.year, DATE.month, DATE.day)
        calendarUICtrl.displayMonthAndYear()
        document.getElementById(CALENDAR_DOM.dates).textContent = ''
        calendarUICtrl.displayFullMonth()
    }

    const setupEventListeners = () => {
        const ctrlDatePicker = (e) => {
            let day = e.target.innerText
            let month = e.target.dataset.month * 1
            let year = e.target.dataset.year

            if (DATE.day >= DATE.day && DATE.month === month || month > DATE.month || DATE.currentYear > DATE.year) {
                calendarUICtrl.datePickerLogic(e)
                calendarUICtrl.selectDates(month, day, year, e.type)
            }
        }

        document.getElementById(CALENDAR_DOM.prevMonth).addEventListener('click', () => {
            calendarCtrl.prevMonth(setNewDate)
        })

        document.getElementById(CALENDAR_DOM.nextMonth).addEventListener('click', () => {
            calendarCtrl.nextMonth(setNewDate)
        })

        document.getElementById(CALENDAR_DOM.dates).addEventListener('click', ctrlDatePicker, false)

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

