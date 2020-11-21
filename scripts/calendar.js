const calendarCtrl = (() => {
    let PRICE = 75
    let now = new Date()

    const DATE = {
        day: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear(),
        currentDay: now.getDay(),
        currentMonth: now.getMonth(),
        currentYear: now.getFullYear(),
    }

    window.__userData__ = {}

    const data = {
        id: 0,
        clicks: 0,
        checkIn: 0,
        checkOut: 0,
        people: 0,
        totalDays: 0,
        totalPrice: 0
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
            delete window.__userData__.checkIn
            delete window.__userData__.checkOut
        },

        formatDate: (dateString) => {
            const d = dateString.split('-')
            return {
                year: d[0] * 1,
                month: d[1] * 1,
                day: d[2] * 1
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
        date: 'date',
        dates: "dates",
        days: "days",
        tHead: 'thtr',
        tBody: 'tb',
        calendarRow: 'ui-calendar',
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
    const weekNames = ["lu", "ma", "mi", "ju", "vi", "sa", "do"]

    return {
        /**
         * It loads the month days into a grid.
         */
        createUICalendar: function () {
            const tHead = document.getElementById(DOMstrings.tHead)
            const tBody = document.getElementById(DOMstrings.tBody)
            const dayOne = calendCtrl.firstOfMonth()
            const totalDays = calendCtrl.getTotalDays(DATE.month)
            let weeks = dayOne === 6 ? 6 : Math.ceil(totalDays / 7)
            let loopOne = true
            let day = 1
            console.log(totalDays)
            tHead.textContent = ''
            tBody.textContent = ''

            for (let i = 0; i <= weekNames.length - 1; i++) {
                tHead.innerHTML += `<th scope="col">${weekNames[i]}</th>`
            }

            for (let i = 0; i < weeks + 1; i++) {
                let row = tBody.insertRow()
                row.classList.add('ui-calendar')

                if (i == 0 && dayOne !== 0) {
                    for (let j = dayOne; j > 0; j--) {
                        let cell = row.insertCell()
                        cell.classList.add('ui-calendar__date--empty')
                        cell.innerHTML = ''
                    }
                }

                for (let j = loopOne ? dayOne : 0; j < 7; j++) {
                    if (day > totalDays) return
                    let cell = row.insertCell()
                    cell.dataset.date = `${DATE.year}-${DATE.month + 1}-${day}`
                    cell.classList.add('ui-calendar')

                    if (
                        day === DATE.day &&
                        DATE.month === DATE.currentMonth &&
                        window.__userData__checkIn !== cell.dataset.date
                    ) {

                        cell.classList.add('ui-calendar__date--today')

                    } else if (
                        day < DATE.day && DATE.month === DATE.currentMonth ||
                        DATE.month < DATE.currentMonth && DATE.year === DATE.currentYear ||
                        DATE.year < DATE.currentYear
                    ) {

                        cell.classList.add('ui-calendar__date--disabled')

                    } else if (
                        day > DATE.day ||
                        DATE.month > DATE.currentMonth && DATE.year === DATE.currentYear ||
                        DATE.year > DATE.currentYear
                    ) {

                        cell.classList.add('ui-calendar__date')

                        if (window.__userData__ !== undefined) {
                            if ('checkIn' in window.__userData__) {
                                cell.dataset.date === window.__userData__.checkIn ?
                                    cell.classList.add('ui-calendar__date--selected') :
                                    null
                            }
                            if (
                                'checkOut' in window.__userData__ &&
                                cell.dataset.date === window.__userData__.checkOut
                            ) {
                                cell.classList.add('ui-calendar__date--selected')
                            }
                        }
                    }
                    cell.innerHTML = `${day}`
                    day++
                    loopOne = false
                }

                if (window.__userData__.checkOut !== undefined) this.inRangeLogic('selected', 'in-range', false, true)
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
         */
        displayInputValue: () => {
            document.getElementById(DOMstrings.checkinEl).innerText = data.checkIn
            document.getElementById(DOMstrings.checkoutEl).innerText = data.checkOut
        },
        /**
         * It changes the value of a type=text input form to empty string
         */
        clearCheckinCheckout: () => {
            document.getElementById(DOMstrings.checkinEl).innerText = '---'
            document.getElementById(DOMstrings.checkoutEl).innerText = '---'
        },
        /**
         * It parses a Nodelist to look for a specific className. 
         * If the condition is met it pushes the elements index.
         */
        findIndexOfSelectedEl: (HTMLCollection, className) => {
            let tdArr = []
            let inOut = []
            let res
            console.log(HTMLCollection)

            Array.from(HTMLCollection).forEach((x, i) => {
                if (x.classList.length > 1 && x.classList[x.classList.length - 1] === `ui-calendar__date--${className}`) {
                    inOut.push(i)
                }

                if (x.computedRole === 'row') {
                    tdArr.push(0)
                } else {
                    tdArr.push(i)
                }
            })

            if (inOut.length == 2) {
                inOut.sort((a, b) => a - b)
                res = tdArr.splice(inOut[0], inOut[1] - inOut[0])
            }
            console.log(res)
            return res
        },
        /**
         * This function adds style to two selected points (checkin, checkout) and fills the distance between
         * those two points by adding a classList.
         */
        inRangeLogic: function (classSelected, classInRange, eTarget, isDateHistory) {
            let element = document.getElementsByClassName(DOMstrings.calendarRow)
            let def = 'ui-calendar__date'

            if (eTarget) {
                let isActive = eTarget.classList.contains(`${def}--${classSelected}`)

                if (!isActive) {
                    eTarget.classList.remove(def)
                    eTarget.classList.add(`${def}--${classSelected}`)
                } else {
                    eTarget.classList.remove(`${def}--${classSelected}`)
                    eTarget.classList.add(def)
                }
            }
            let response = this.findIndexOfSelectedEl(element, classSelected)

            if (response) {
                for (let i = 1; i < response.length; i++) {
                    if (response[i] > 0) {
                        element[response[i]].classList.remove(def)
                        element[response[i]].classList.add(`${def}--${classInRange}`)
                    }
                }

            } else if (data.clicks == 2) {

                if (!isDateHistory) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].classList.remove(`${def}--${classInRange}`)
                        element[i].classList.remove(`${def}--${classSelected}`)
                    }
                }

                if (eTarget) eTarget.classList.add(`${def}--${classSelected}`)
            }
        },
        /**
         * Stores checkin and checkout date in data object (calendarCtrl) 
         * it is depending on the clicks it recieves.
         */
        selectDates: function (y, m, d) {
            data.clicks == 2 ? (calendCtrl.cleanDataObject(data),
                this.clearCheckinCheckout()) : null

            if (data.clicks == 0) {
                window.__userData__.checkIn = `${y}-${m}-${d}`

                data.checkIn = `${d}-${m}-${y}`
                data.clicks++

            } else if (data.clicks == 1) {
                window.__userData__.checkOut = `${y}-${m}-${d}`

                data.checkOut = `${d}-${m}-${y}`
                data.clicks++
                this.sortDateAndDisplay()
                data.totalDays = calendarCtrl.totalDaysBetweenDates(window._in, window._out)
            }
            console.log({ checkIn: window.__userData__.checkIn, checkOut: window.__userData__.checkOut })
            console.log(data)
        },
        /**
         * It finds the greatest of two dates, and re-orders the data object if necessary.
         * **Disclaimer: Try not to use the window obj to store global data**
         */
        sortDateAndDisplay: () => {
            let _in = window.__userData__.checkIn
            let _out = window.__userData__.checkOut
            let dtIn = new Date(_in)
            let dtOut = new Date(_out)

            if ((_in && _out) && (dtIn.getTime() > dtOut.getTime())) {
                let temp

                temp = data.checkIn
                data.checkIn = data.checkOut
                data.checkOut = temp

                calendarUICtrl.displayInputValue()

                delete window._in
                delete window._out

            } else {
                calendarUICtrl.displayInputValue()
            }
        },
        /**
         * Inserts a Node element
         */
        displayResults: () => {
            const parentEl = document.getElementById(DOMstrings.result)
            const numOfpeople = document.getElementById(DOMstrings.searchBox).value
            const HTML = `
                <div class="result-container">
                    <h3>Thank you for booking with us</h3>
                    <p>Your reservation details:</p>
                    <p>Checkin: ${data.checkIn}</p>
                    <p>Checkout: ${data.checkOut}</p>
                    <p>Nights: ${data.totalDays}</p>
                    <p>Total ${numOfpeople < 2 ? 'host' : 'hosts'} : ${numOfpeople}</p>
                    <div>
                        <p>65€/<span>pppn</span></p>
                        <p>TOTAL: ${data.totalPrice}€<p>
                    </div>
                </div>
            `
            parentEl.innerHTML = ''
            parentEl.insertAdjacentHTML('beforeend', HTML)
        },
        /**
         * loads the view by hydrating the HTML template string 
         * into the specified DOM element.
         */
        loadView: (view) => {
            const root = document.getElementById(DOMstrings.root)
            const hydrate = root.insertAdjacentHTML("beforeend", view)
            return hydrate
        },
        /**
         * It accesses object from calendarCtrl scope.
         */
        getDOMstrings: () => DOMstrings,

    }
})(calendarCtrl)

define(() => {
    const CALENDAR_DOM = calendarUICtrl.getDOMstrings();
    const DATE = calendarCtrl.getDateObjects()
    let now = calendarCtrl.getDateInicializer()


    const setNewDate = (e) => {
        now.setFullYear(DATE.year, DATE.month, DATE.day)
        calendarUICtrl.displayMonthAndYear()
        calendarUICtrl.createUICalendar()
    }

    const setupEventListeners = () => {
        const ctrlDatePicker = (e) => {
            let d, day, month, year
            d = calendarCtrl.formatDate(e.target.dataset.date)
            day = d.day
            month = d.month
            year = d.year

            calendarUICtrl.inRangeLogic('selected', 'in-range', e.target, false)
            console.log(e.target)
            calendarUICtrl.selectDates(year, month, day)
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
            calendarUICtrl.createUICalendar()
            setupEventListeners()
        }
    }
})

