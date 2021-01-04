export function dec2hex(dec) {
    return convertBase(dec.split('').map(Number), 10, 16)
        .map(digit => Number(digit).toString(16)).join('')
}

export function convertBase(value, fromBase, toBase = 10) {
    if (!Array.isArray(value)) {
        throw new Error("Provided value must be an array, e.g. the decimal number 365 would be represented [3, 6, 5], the hexadecimal number 0x3E would be represented [3, 14].")
    }

    const result = []
    let number = value.slice()

    while (number.length) {
        const quotient = []
        let remainder = 0
        const length = number.length
        for (let i = 0; i !== length; i++) {
            let accumulator = number[i] + remainder * fromBase
            let digit = Math.floor(accumulator / toBase)
            remainder = accumulator % toBase
            if (quotient.length || digit) quotient.push(digit)
        }
        result.unshift(remainder)
        number = quotient
    }

    return result
}

export const BINARY = "01"
export const QUATERNARY = "0123"
export const OCTAL = "01234567"
export const DECIMAL = "0123456789"
export const HEXADECIMAL = "0123456789ABCDEF"

export function convert(_value, _fromWordList = DECIMAL, _toWordList = DECIMAL, _separator) {
    const fromWordList = Array.isArray(_fromWordList) ? _fromWordList : _fromWordList.split("")
    const toWordList = Array.isArray(_toWordList) ? _toWordList : _toWordList.split("")
    const value = (Array.isArray(_value) ? _value : _value.split("")).map(v => fromWordList.indexOf(v))
    const separator = _separator != undefined ? _separator : (toWordList[1].length > 1 ? " " : "")
    return convertBase(value, fromWordList.length, toWordList.length).map(x => toWordList[x]).join(separator)
}
