const calendarCtrl = (() => {
    let now = new Date()
    const PRICE = 75
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
        checkIn: 0,
        checkOut: 0,
        clicks: 0,
        monthIn: null,
        monthOut: null,
        people: 0,
        selected: null,
        totalNights: 0,
        totalDays: 0,
    }

    const eventData = {
        click: 0,
        dateIdxIn: 0,
        dateIdxOut: 0
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

        totalNightsBetweenDates: (date1, date2) => {
            const diffInTime = date2 - date1
            const nightsBetweenDates = diffInTime / (1000 * 3600 * 24)

            return Math.abs(nightsBetweenDates).toFixed()
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

        getTotalPrice: () => {
            return PRICE * data.totalNights
        },
        /**
         * Using native javascript intenationalization API to format price
         */
        formatPrice: (price) => {
            const formatter = new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR'
            })

            return formatter.format(price)
        },

        getData: () => data,

        getEventData: () => eventData,

        getDateObjects: () => DATE,

        getDateInicializer: () => now,

        getTimeSince: (date) => new Date(date).getTime(),

        upDateWinUserData: function (key, year, month, day) {
            let user = window.__userData__

            user[`${key}`] = {
                string: `${year}-${month}-${day}`,
                year: year,
                month: month,
                day: day,
                since: this.getTimeSince(`${year}-${month}-${day}`)
            }
        }
    }
})()

const calendarUICtrl = (calendCtrl => {
    const DATE = calendCtrl.getDateObjects()
    const data = calendCtrl.getData()
    const eventData = calendCtrl.getEventData()

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
        calendar: '.calendar',
        input: 'select',
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
            //console.log('createUICalendar: line 153')
            const tHead = document.getElementById(DOMstrings.tHead)
            const tBody = document.getElementById(DOMstrings.tBody)
            const dayOne = calendCtrl.firstOfMonth()
            const totalDays = calendCtrl.getTotalDays(DATE.month)
            let weeks = dayOne === 6 ? 6 : Math.ceil(totalDays / 7)
            let loopOne = true
            let day = 1

            tHead.textContent = ''
            tBody.textContent = ''
            console.log(DATE.currentYear)
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
                        DATE.month === DATE.currentMonth
                    ) {

                        cell.classList.add('ui-calendar__date--today')

                    } else if (
                        day < DATE.day && DATE.month === DATE.currentMonth ||
                        DATE.month < DATE.currentMonth && DATE.year === DATE.currentYear ||
                        DATE.year < DATE.currentYear
                    ) {

                        cell.classList.add('ui-calendar__date--disabled')

                    }

                    if (Object.keys(window.__userData__).length !== 0) {
                        let userData = window.__userData__
                        if (
                            'checkIn' in userData &&
                            cell.dataset.date === userData.checkIn.string
                        ) {
                            cell.classList.remove('ui-calendar__date--today')
                            cell.classList.add('ui-calendar__date--selected')
                        }
                        if (
                            'checkOut' in userData &&
                            cell.dataset.date === userData.checkOut.string
                        ) {
                            cell.classList.add('ui-calendar__date--selected')
                        }


                        if ('checkIn' in userData && 'checkOut' in userData) {

                            if (
                                (DATE.month + 1) > userData.checkIn.month &&
                                (DATE.month + 1) < userData.checkOut.month
                            ) {
                                cell.classList.add('ui-calendar__date--in-range')

                            } else if (
                                (DATE.month + 1) == 1 && userData.checkIn.month == 12 &&
                                (DATE.month + 1) < userData.checkOut.month &&
                                DATE.currentYear < userData.checkOut.year
                            ) {
                                cell.classList.add('ui-calendar__date--in-range')
                            }

                        }

                    }

                    cell.innerHTML = `${day}`
                    day++
                    loopOne = false
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
         */
        displayInputValue: () => {
            document.getElementById(DOMstrings.input).value = `${data.checkIn} / ${data.checkOut}`

        },
        /**
         * It changes the value of a type=text input form to empty string
         */
        clearInputValue: () => {
            document.getElementById(DOMstrings.input).placeholder = 'Check-in / Check-out'
        },

        toggleCalendarDisplay: () => {
            document.querySelector(DOMstrings.calendar).classList.toggle('calendar-none')

        },
        /**
         * This function controls the style by adding or removing classList property.
         * It uses the findIndexOFSelectedEl() to determine the nodes that has to be modified
         */
        inRangeLogic: function (classSelected, classInRange) {
            const element = document.getElementsByClassName(DOMstrings.calendarRow)
            const def = 'ui-calendar__date'

            let response = this.findIndexOfSelectedEl(element, classSelected)

            if (response) {
                for (let i = 1; i < response.length; i++) {
                    if (!!response[i]) { //the !! converts the response type to Boolean, any number is 'true', and 0 is 'false'.
                        element[response[i]].classList.add(`${def}--${classInRange}`)
                    }
                }
            }
        },
        /**
         * Reset data and DOM to default state
         */
        toDefaultState: function (cssClass1, cssClass2) {
            let el = document.getElementsByClassName(DOMstrings.calendarRow)

            for (let i = 0; i < el.length; i++) {
                el[i].classList.remove(`ui-calendar__date--${cssClass1}`)
                el[i].classList.remove(`ui-calendar__date--${cssClass2}`)
            }

            calendCtrl.cleanDataObject(data)
            calendCtrl.cleanDataObject(eventData)

            this.clearInputValue()
        },
        /**
         * It parses a Nodelist to look for a specific className, in this case it's [--selected].
         * It picks the Index of the checkIn and checkOut dates and all the nodes that are in between, and saves
         * them to an array.
         * If the parsed node is a Table-Row it pushes a 0 as value to the array, to let inRangeLogic() function
         * know that this value has not to be parsed.
         */
        findIndexOfSelectedEl: (HTMLCollection, className) => {
            let tdArr = []
            let selectedDates = []
            let inRangeArr
            //console.log(HTMLCollection)
            Array.from(HTMLCollection).forEach((x, i) => {
                if (x.classList[x.classList.length - 1] === `ui-calendar__date--${className}`) {
                    selectedDates.push(i)

                    if (eventData.click == 1) eventData.dateIdxIn = i
                    if (eventData.click == 2) eventData.dateIdxOut = i
                }
                if (x.computedRole === 'row') {
                    tdArr.push(0)
                } else {
                    tdArr.push(i)
                }
            })
            //console.log(selectedDates)
            if (selectedDates.length == 2) {
                selectedDates.sort((a, b) => a - b)
                inRangeArr = tdArr.splice(selectedDates[0], selectedDates[1] - selectedDates[0])
                data.selected = inRangeArr
            } else if (selectedDates.length < 2 && eventData.click == 2) {

                if ((DATE.month + 1) === data.monthIn) {
                    inRangeArr = tdArr.splice(eventData.dateIdxIn)
                }
                if ((DATE.month + 1) === data.monthOut) {
                    inRangeArr = tdArr.splice(0, eventData.dateIdxOut)
                }

            }
            //console.log(res)
            return inRangeArr
        },
        /**
        * It checks whether the target cell is selected or not.
        */
        isSelected: (eTarget, classSelected) => {
            const def = 'ui-calendar__date'

            if (eTarget) {
                const isActive = eTarget.classList.contains(`${def}--${classSelected}`)

                if (!isActive) {
                    eTarget.classList.add(`${def}--${classSelected}`)
                } else {
                    eTarget.classList.remove(`${def}--${classSelected}`)
                }
            }

        },
        /**
         * Stores checkin and checkout date in data object (calendarCtrl)
         * it is depending on the clicks it recieves.
         */
        saveDates: function (date, arg) {
            const { year, month, day } = date || {}
            let y, m, d

            y = year
            m = month
            d = day

            let w_userData = window.__userData__

            switch (arg) {
                case ('checkIn'):
                    calendCtrl.upDateWinUserData('checkIn', y, m, d)
                    data.checkIn = `${d}-${m}-${y}`
                    data.monthIn = m
                    break
                case ('checkOut'):
                    calendCtrl.upDateWinUserData('checkOut', y, m, d)
                    data.checkOut = `${d}-${m}-${y}`
                    data.monthOut = m
                    this.sortDateAndDisplay()
                    data.totalNights = calendCtrl.totalNightsBetweenDates(w_userData.checkIn.since, w_userData.checkOut.since)
                    data.totalDays = data.totalNights + 1
                    break
            }

        },
        /**
         * It finds the greatest of two dates, and re-orders the data object if necessary.
         * **Disclaimer: Try not to use the window obj to store global data**
         */
        sortDateAndDisplay: () => {
            let _in = window.__userData__.checkIn.string
            let _out = window.__userData__.checkOut.string
            let dtIn = new Date(_in)
            let dtOut = new Date(_out)

            if ((_in && _out) && (dtIn.getTime() > dtOut.getTime())) {
                let temp

                temp = data.checkIn
                data.checkIn = data.checkOut
                data.checkOut = temp

                calendarUICtrl.displayInputValue()

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
            const totalAmount = calendCtrl.formatPrice(calendCtrl.getTotalPrice())
            const HTML = `
                <div class="cal-res">
                    <h3>Thank you for booking with VanillaJS.</h3>
                    <p>Your reservation details:</p>
                    <ul class="cal-res__ul">
                    <li><div class="cal-res-ul__li">
                            <ion-icon name="log-in-outline"></ion-icon>
                            <p>Check-in: <span class="cal-data">${data.checkIn}</span></p>
                    <div></li>
                    <li><div class="cal-res-ul__li">
                            <ion-icon name="log-out-outline"></ion-icon>
                            <p>Check-out: <span class="cal-data">${data.checkOut}</span></p>
                    <div></li>
                    <li><div class="cal-res-ul__li">
                            <ion-icon name="moon-outline"></ion-icon>
                            <p>Nights: <span class="cal-data">${data.totalNights}</span></p>
                    </div></li>
                    <li><div class="cal-res-ul__li">
                            <ion-icon name="people-outline"></ion-icon>
                            <p>Total ${numOfpeople < 2 ? 'host' : 'hosts'}: <span class="cal-data">${numOfpeople}</span></p>
                    </div></li>
                    <li><div class="cal-res-ul__li">
                            <p>TOTAL: <span class="data">${totalAmount}</span>
                            <span class="abrev cal-data">75€/pppn</span><p>
                    </div></li>
                    </ul>
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
    let data = calendarCtrl.getData()
    let eventData = calendarCtrl.getEventData()

    const setNewDate = () => {
        now.setFullYear(DATE.year, DATE.month, DATE.day)
        calendarUICtrl.displayMonthAndYear()
        calendarUICtrl.createUICalendar()

        if (
            (DATE.month + 1) === data.monthIn ||
            (DATE.month + 1) === data.monthOut
        ) {
            calendarUICtrl.inRangeLogic('selected', 'in-range')
        }
    }

    const datePickerFunctions = (e, date, arg, cssClass1, cssClass2) => {
        calendarUICtrl.isSelected(e.target, cssClass1)
        calendarUICtrl.saveDates(date, arg)
        calendarUICtrl.inRangeLogic(cssClass1, cssClass2)
    }

    const ctrlDatePicker = (e) => {
        let date = calendarCtrl.formatDate(e.target.dataset.date)

        eventData.click++

        switch (eventData.click) {
            case (1):
                datePickerFunctions(e, date, 'checkIn', 'selected', 'in-range')
                break
            case (2):
                datePickerFunctions(e, date, 'checkOut', 'selected', 'in-range')
                calendarUICtrl.toggleCalendarDisplay()
                break
            case (3):
                calendarUICtrl.toDefaultState('selected', 'in-range')
                eventData.click++
                datePickerFunctions(e, date, 'checkIn', 'selected', 'in-range')
                break
        }

    }

    const setupEventListeners = () => {
        document.getElementById(CALENDAR_DOM.input).addEventListener('click', () => {
            calendarUICtrl.toggleCalendarDisplay()
        })

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

