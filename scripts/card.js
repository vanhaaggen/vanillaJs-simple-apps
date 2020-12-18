
const cardUICtrl = (function () {
    const DOM_STRING = {
        input: 'card-num',
        cardFront: '.card-front',
        cardBack: '.card-back'
    }

    const SVGtext = (x, y, fFamily, fSize, text, svgProp) => {
        return `
        <text 
        transform="matrix(1 0 0 1 ${x} ${y})" 
        font-family="${fFamily}" 
        font-size="${fSize}"
        ${svgProp}>
        ${text}
        </text>
        `
    }

    const bankName = name => SVGtext(19.5, 28, 'Arial', 18, name)

    const cardHolderName = name => SVGtext(24, 185, 'Arial-Bold', 14, name, 'letter-spacing="2"')

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

    return {
        getDomString: () => {
            return DOM_STRING
        },

        loadView: (view) => {
            const hydrate = document.getElementById('root').insertAdjacentHTML("beforeend", view)
            return hydrate
        },

        cardFront: (cardNumbers) => {
            const parentEl = document.querySelector(DOM_STRING.cardFront)
            const SVG = `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="328.8px"
         height="211.52px" viewBox="0 0 328.8 211.52" enable-background="new 0 0 328.8 211.52" xml:space="preserve">
                <g id="chip">
                    <g>
                        <path fill="#CBBAF7" d="M84,84c0-3.866-3.134-7-7-7H46c-3.866,0-7,3.134-7,7v18c0,3.866,3.134,7,7,7h31c3.866,0,7-3.134,7-7V84z"
                            />
                        <path fill="none" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" d="M83.5,83.5c0-3.866-3.134-7-7-7h-31
                            c-3.866,0-7,3.134-7,7v18c0,3.866,3.134,7,7,7h31c3.866,0,7-3.134,7-7V83.5z"/>
                    </g>
                    <path fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" d="M26.484,78c4.931,8.541,4.931,19.063,0,27.604
                         M20.412,81.036c3.846,6.662,3.846,14.87,0,21.531 M14.615,83.824c2.781,4.868,2.781,10.866,0,15.734 M8.818,86.833
                        c2.009,3.041,2.009,6.896,0,9.938"/>
                </g>
                <g id="brand">
                    <g transform="matrix(0.762 0 0 1 257 174.1084)">${'brandImage'}</g>
                </g>
                ${cardHolderName('CHRISTIAN M. HAAG')}
                ${expiresEnd(10, 23)}
                ${cardNumber(cardNumbers, 4)}
                ${bankName('Banco Sabadell')}
                </svg>
                        `
            parentEl.innerHTML = ''
            parentEl.insertAdjacentHTML('beforeend', SVG)
        }
    }


})()


define(() => {
    const DOM = cardUICtrl.getDomString()

    const fetchApi = (e) => {
        // if (e.length === 6) {
        //     const requestOptions = {
        //         method: 'GET'
        //     }

        //     fetch(`https://lookup.binlist.net/${e}`, requestOptions)
        //         .then(response => response.json())
        //         .then(result => console.log(result))
        //         .catch(error => console.log('error', error));
        // }
        cardUICtrl.cardFront(e)

    }


    const setupEventListeners = () => {
        document.getElementById(DOM.input).addEventListener('input', (e) => fetchApi(e.target.value))
    }

    return {
        init: (view) => {
            document.getElementById('root').innerHTML = ""
            cardUICtrl.loadView(view)
            setupEventListeners()
        },
    }
})