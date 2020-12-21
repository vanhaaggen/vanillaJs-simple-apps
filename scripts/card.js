const cardModelCtrl = (function () {

    const userData = {
        cardNumber: '',
        cardHolder: '',
        month: '',
        year: '',
        cvd: '',
        bank: '',
        scheme: '',
        method: ''
    }

    const BANK_ENTITIES = [
        'banesto',
        'bankia',
        'caixa',
        'bbva',
        'sabadell',
        'ing',
        'santander',
        'openbank',
        'kutxabank',
        'bankinter',
    ]

    return {
        getData: () => {
            return userData
        },

        cleanDataObject: (obj) => {
            for (let val in obj) {
                if (obj.hasOwnProperty(val)) {
                    obj[val] = ''
                }
            }
        },

        normalizeBankName: (fiscalName) => {
            let bank
            let formatFiscName = fiscalName.toLowerCase()

            BANK_ENTITIES.forEach(x => {
                if (formatFiscName.indexOf(x) > -1) bank = x
            })
            return bank
        }
    }
})()

const cardUICtrl = (function () {
    const DOM_STRING = {
        card: '.card',
        input: 'card-num',
        form: 'card-form',
        cardFront: '.card-front',
        cardBack: '.card-back',
        svgCard: '.svg-card',
        cardMonth: 'card-month',
        cardYear: 'card-year',
        cardCVD: 'card-cvd'
    }

    const isNavigator = (navigator) => {
        const ua = window.navigator.userAgent
        const nav = ua.indexOf(navigator)
        if (nav > 0) {
            return true
        }

    }
    const SVGtext = (x, y, fFamily, fSize, text, svgProp) => {
        let isFireFox = isNavigator('Firefox/')

        return `
        <text 
        transform="matrix(1 0 0 1 ${isFireFox ? x - 62 : x} ${y})" 
        font-family="${fFamily}" 
        font-size="${fSize}"
        ${svgProp}>
        ${text}
        </text>
        `
    }

    const bankName = name => SVGtext(19.5, 28, 'Arial', 18, name)

    const cardHolderName = name => SVGtext(24, 185, 'Arial-Bold', 14, name, 'letter-spacing="2"')

    const paymentMethod = method => SVGtext(245.667, 28, 'Arial', 12, method)

    const cardNumber = (numbers, numOfChunks) => {
        const iterations = numbers.length / numOfChunks
        let chunksArr = []
        let start = 0
        let end = 4

        for (let i = 0; i < iterations; i++) {
            chunksArr.push(numbers.substring(start, end))
            start += 4
            end += 4
        }
        let fFamily = 'Arial'
        let fSize = 25
        let arr = [
            SVGtext(29, 143, fFamily, fSize, chunksArr[0] || ''),
            SVGtext(99, 143, fFamily, fSize, chunksArr[1] || ''),
            SVGtext(168, 143, fFamily, fSize, chunksArr[2] || ''),
            SVGtext(242, 143, fFamily, fSize, chunksArr[3] || '')
        ]

        return arr
    }

    const expiresEnd = (month, year) => {
        let fFamily = 'ArialMT'
        let fSize = 11
        let arr = [
            SVGtext(143, 168, 'Arial', 9, 'EXPIRES'),
            SVGtext(188.667, 166, fFamily, fSize, month),
            SVGtext(211.333, 166, fFamily, fSize, year),
            SVGtext(205, 166, fFamily, fSize, '/'),
        ]
        return arr
    }

    const brandLogo = (scheme) => {
        const path = `../vanilla/resources/card/${scheme}.png`
        let isVisa = scheme === 'visa'
        const size = {
            height: isVisa ? 30 : 50,
            width: isVisa ? 69 : 89,
            y: isVisa ? 170 : 150
        }
        return `
        <g 
        transform="matrix(1 0 0 1 240 ${size.y})"
        >
        <image 
        href="${path}"
        height= "${size.height}"
        width="${size.width}"/>
        </g>
        `
    }

    const loadMonthOptions = (numMonth) => {
        let monthElement = document.getElementById(DOM_STRING.cardMonth)

        for (let i = 1; i <= numMonth; i++) {
            let newElement = `<option value="${i}">${i}</option>`
            monthElement.insertAdjacentHTML('beforeend', newElement)
        }

    }

    const loadYearOptions = (currentYear, years) => {
        let yearElement = document.getElementById(DOM_STRING.cardYear)

        for (let i = 0; i <= years; i++) {
            let year = currentYear + i
            let newElement = `<option value="${year}">${year}</option>`
            yearElement.insertAdjacentHTML('beforeend', newElement)
        }

    }


    return {
        getDomString: () => {
            return DOM_STRING
        },

        loadView: (view) => {
            const hydrate = document.getElementById('root').insertAdjacentHTML("beforeend", view)
            return hydrate
        },

        loadOptions: (numMonth, currYear, numYears) => {
            loadMonthOptions(numMonth)
            loadYearOptions(currYear, numYears)
        },

        turnCard: () => {
            const element = document.querySelector(DOM_STRING.card)
            element.classList.toggle('turn-card')
        },

        displayCard: (bank = '', month = '', year = '', number = '', cardHolder = '', scheme = '', type = '', cvd = '') => {
            const parentEl = document.querySelector(DOM_STRING.cardFront)
            const SVG = `
            <svg class="svg-card" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="328.8px"
             height="211.52px" viewBox="0 0 328.8 211.52" enable-background="new 0 0 328.8 211.52" xml:space="preserve">
                <g id="chip">
                        <path fill="#adabab" d="M84,84c0-3.866-3.134-7-7-7H46c-3.866,0-7,3.134-7,7v18c0,3.866,3.134,7,7,7h31c3.866,0,7-3.134,7-7V84z"/>
                        <path fill="none" stroke="#ffffff" stroke-linejoin="round" stroke-miterlimit="10" d="M83.5,83.5c0-3.866-3.134-7-7-7h-31
                        c-3.866,0-7,3.134-7,7v18c0,3.866,3.134,7,7,7h31c3.866,0,7-3.134,7-7V83.5z"/>
                    </g>

                    <path fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" d="M22.624,81.897c3.789,6.561,3.789,14.644,0,21.206
                    M17.959,84.229c2.955,5.118,2.955,11.423,0,16.542 M13.505,86.371c2.137,3.741,2.137,8.348,0,12.088 M9.052,88.683
                   c1.544,2.335,1.544,5.299,0,7.634"/>
                </g>
                ${bankName(bank)}
                ${paymentMethod(type)}
                ${cardNumber(number, 4)}
                ${expiresEnd(month, year)}
                ${cardHolderName(cardHolder)}
                ${scheme ? brandLogo(scheme, 20, 59) : ''}
            </svg>`

            parentEl.innerHTML = ''
            parentEl.insertAdjacentHTML('beforeend', SVG)
        }
    }

})()


define(() => {
    const DOM = cardUICtrl.getDomString()
    const userData = cardModelCtrl.getData()
    const date = new Date()
    const currentYear = date.getFullYear()

    const fetchApi = async (e) => {
        if (e.length === 6) {
            const requestOptions = {
                method: 'GET'
            }
            try {
                const response = await fetch(`https://lookup.binlist.net/${e}`, requestOptions)
                const result = await response.json()

                userData.bank = cardModelCtrl.normalizeBankName(result.bank.name) || result.bank.name
                userData.brand = result.brand
                userData.scheme = result.brand === 'maestro' ? 'maestro' : result.scheme

                console.log(result)
            } catch (error) {
                return console.log('error', error)
            }
        }

    }

    const eDelegator = async (e) => {
        switch (e.target.id) {
            case 'card-num':
                userData.cardNumber = e.target.value
                await fetchApi(e.target.value)
                flag = true
                break;
            case 'card-holder':
                userData.cardHolder = e.target.value.toUpperCase()
                break;
            case 'card-month':
                userData.month = e.target.value
                break
            case 'card-year':
                userData.year = e.target.value
                break
            case 'card-cvd':
                userData.cvd = e.target.value
        }

        cardUICtrl.displayCard(
            userData.bank,
            userData.month,
            userData.year,
            userData.cardNumber,
            userData.cardHolder,
            userData.scheme,
            userData.type,
            userData.cvd,
        )
    }

    const setupEventListeners = () => {

        document.getElementById(DOM.form).addEventListener('input', (e) => eDelegator(e))

        document.getElementById(DOM.cardCVD).addEventListener('focusin', () => cardUICtrl.turnCard())
        document.getElementById(DOM.cardCVD).addEventListener('focusout', () => cardUICtrl.turnCard())

    }

    return {
        init: (view) => {
            document.getElementById('root').innerHTML = ""
            cardModelCtrl.cleanDataObject(userData)
            cardUICtrl.loadView(view)
            cardUICtrl.loadOptions(12, currentYear, 20)
            cardUICtrl.displayCard()
            setupEventListeners()
        },
    }
})