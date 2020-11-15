const calendarCtrl = (() => {
    let now = new Date()

    const DATE = {
        day: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear(),
        currentDay: now.getDay(),
        currentMonth: now.getMonth(),
        currentYear: now.getFullYear(),
    }

    const data = {
        element: [],
        clicks: 0,
        checkIn: 0,
        checkOut: 0,
        people: 0,
        totalDays: 0,
    }

    const isLeapYear = () => ((DATE.year % 100 !== 0) && (DATE.year % 4 === 0) || (DATE.year % 400 === 0))

    return {

        firstOfMonth: () => {
            let dayOne = new Date(DATE.year, DATE.month, 1)
            return ((dayOne.getDay() - 1) === -1) ? 6 : dayOne.getDay() - 1
        },

        getTotalDays: (month) => {
            if (month === -1) month = 11

            if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
                return 31

            } else if (month == 3 || month == 5 || month == 8 || month == 10) {
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
            delete window.bookingData
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
        root: 'root',
        btnSubmit: 'btn-submit',
        result: 'result',
        searchBox: 'search-box'
    }

    return {
        /**
         * It loads the month days into a grid.
         */
        displayFullMonth: () => {
            let datesElement = document.getElementById(DOMstrings.dates)
            let firstOfMonth = calendCtrl.firstOfMonth()
            let totalMonthDays = calendCtrl.getTotalDays(DATE.month)
            let prevMonthDays = calendCtrl.getTotalDays(DATE.month - 1)

            for (let i = firstOfMonth; i > 0; i--) {
                //I add 1 to prevMonthDays so it starts to substract from the actual last date.
                let lastDays = (prevMonthDays + 1) - i
                datesElement.innerHTML += ` <div class="days calendar__date calendar__item calendar__last-days" id="date" data-month="${DATE.month - 1 == -1 ? 11 : DATE.month - 1}" data-year="${DATE.year}">${lastDays}</div>`
            }

            for (let i = 1; i <= totalMonthDays; i++) {
                if (
                    i < DATE.day && DATE.month === DATE.currentMonth ||
                    DATE.month < DATE.currentMonth && DATE.year === DATE.currentYear ||
                    DATE.year < DATE.currentYear
                ) {

                    datesElement.innerHTML += ` <div class="days calendar__date calendar__item calendar__last-days" id="date" data-month="${DATE.month}" data-year="${DATE.currentYear}">${i}</div>`

                } else if (
                    i >= DATE.day ||
                    DATE.month > DATE.currentMonth && DATE.year === DATE.currentYear ||
                    DATE.year > DATE.currentYear
                ) {
                    datesElement.innerHTML += ` <div class="days calendar__date calendar__item calendar__following-days" id="date" data-month="${DATE.month}" data-year="${DATE.year}">${i}</iv>`
                }

            }
        },
        /**
         * It shows the Month name.
         */
        displayMonthAndYear: () => {
            let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let monthElement = document.getElementById(DOMstrings.month)
            let yearElement = document.getElementById(DOMstrings.year)

            monthElement.textContent = monthNames[DATE.month]
            yearElement.textContent = DATE.year.toString()
        },

        /**
         * Adds the value checkin and checkout data to the input field of type=text.
         * 
         * @param {String} elID (ID of the element)
         * @param {Object} dataObj (Data object stored in calendarCtrl)
         */
        showCheckinCheckout: (elID, dataObj) => {
            document.getElementById(elID).value = dataObj
        },
        /**
         * It changes the value of a type=text input form to empty string
         */
        clearCheckinCheckout: () => {
            document.getElementById(DOMstrings.checkinEl).value = ''
            document.getElementById(DOMstrings.checkoutEl).value = ''
        },
        /**
         * It parses a Nodelist to look for a specific className. If the condition is met it pushes the elements index.
         * @param {Array<Nodelist>} HTMLCollection  
         * @param {string} className 
         * 
         * @returns {Array<number>}  Array<number>
         */
        findIndexOfHTMLCollection: (HTMLCollection, className) => {
            let res = []
            Array.from(HTMLCollection).forEach((el, i) => el.classList.contains(className) ?
                res.push(i) : null)

            return res
        },
        /**
         * This function adds style to two selected points (checkin, checkout) and fills the distance between 
         * those two points by adding a classList.
         * 
         * @param {*} e  event
         * @param {*} domEl  DOM element className
         * @param {*} parentEl  Parent element className
         * @param {*} classActive  className
         * @param {*} classDistance  className
         */
        datePickerLogic: function (e, domEl, parentEl, classActive, classDistance) {
            let element = document.getElementsByClassName(domEl)

            if (e.target.parentElement.className === parentEl) {
                let isActive = e.target.classList.contains(classActive)

                if (!isActive) {
                    e.target.classList.add(classActive)
                } else {
                    e.target.classList.remove(classActive)
                }

                let idxOfHTMLColl = this.findIndexOfHTMLCollection(element, classActive)

                if (idxOfHTMLColl.length === 2) {
                    for (let i = idxOfHTMLColl[0] + 1; i < idxOfHTMLColl[1]; i++) {
                        element[i].classList.add(classDistance)
                    }

                } else if (data.clicks == 2 || idxOfHTMLColl.length >= 2) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].classList.remove(classDistance)
                        element[i].classList.remove(classActive)
                    }

                    e.target.classList.add(classActive)
                }
            }

        },
        /**
         * Stores checkin and checkout date in data object (calendarCtrl) it is depending on the clicks it recieves.
         * @param {*} m  month
         * @param {*} d  day
         * @param {*} y year
         */
        selectDates: function (m, d, y) {
            data.clicks == 2 ? (calendCtrl.cleanDataObject(data),
                this.clearCheckinCheckout()) : data.clicks

            if (data.clicks == 0) {
                data.checkIn = `${d}/${m + 1}/${y}`
                data.clicks++
                this.showCheckinCheckout(DOMstrings.checkinEl, data.checkIn)
            } else if (data.clicks == 1) {
                data.checkOut = `${d}/${m + 1}/${y}`
                data.clicks++
                this.showCheckinCheckout(DOMstrings.checkoutEl, data.checkOut)
                data.totalDays = calendarCtrl.totalDaysBetweenDates(data.checkIn, data.checkOut)
            }

            console.log(data)
        },
        displayResults: () => {
            const parentEl = document.getElementById(DOMstrings.result)
            const numOfpeople = document.getElementById(DOMstrings.searchBox).value
            const HTML = `
                <div>
                    <p>Checkin: ${data.checkIn}</p>
                    <p>Checkout: ${data.checkOut}</p>
                    <p>Num of ppl: ${numOfpeople}</p>
                </div>
            `
            parentEl.innerHTML = ''
            parentEl.insertAdjacentHTML('beforeend', HTML)
        },
        /**
         * loads the view by hydrating the HTML template string into the specified DOM element.
         * @returns DOM element
         */
        loadView: (view) => {
            const root = document.getElementById(DOMstrings.root)
            const hydrate = root.insertAdjacentHTML("beforeend", view)
            return hydrate
        },
        /**
         * It accesses object from calendarCtrl scope.
         * @returns {Object} DOMstring object
         */
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

            if (DATE.day >= DATE.currentDay && DATE.month === month || month > DATE.month || DATE.currentYear > DATE.year) {
                calendarUICtrl.datePickerLogic(e, CALENDAR_DOM.days, 'calendar__dates', 'active', 'distance')
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

        document.getElementById(CALENDAR_DOM.btnSubmit).addEventListener('click', (e) => {
            e.preventDefault()
            calendarUICtrl.displayResults()
        })

    }

    return {
        init: (view) => {
            document.getElementById('root').innerHTML = ""
            calendarUICtrl.loadView(view)
            calendarUICtrl.displayMonthAndYear()
            calendarUICtrl.displayFullMonth()
            setupEventListeners()
        }
    }
})

