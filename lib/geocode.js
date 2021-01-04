import S2Geom from 's2-geometry'
import distanceFrom from 'distance-from'
import {dec2hex} from "./radix.js"
import {checkmoji} from "./wordlist/checkmoji.js"

const S2 = S2Geom.S2

export function fromWordList(wordlist) {
    if (wordlist.length < 32) {
        throw new Error("Your wordlist must have at least 32 words in it (giving at least 5 bits per word)")
    }
    const bitsPerWord = Math.floor(Math.log2(wordlist.length))
    const firstLevels = Math.floor((bitsPerWord - 3) / 2)
    const levelsPerAdditionalWord = Math.floor(bitsPerWord/2)
    const recommendedLevels = [firstLevels]
    let recLvl = firstLevels
    let defaultLevel = 0

    do {
        recLvl = Math.min(30, recLvl + levelsPerAdditionalWord)
        if (recLvl >= 22 && defaultLevel === 0) {
            defaultLevel = recLvl
        }
        recommendedLevels.push(recLvl)
    } while (recLvl < 30)

    function keyToPhrase(key) {
        let face = Number(key.substring(0, 1))
        const address = key.substring(2)

        if (recommendedLevels.indexOf(address.length) < 0) {
            console.warn(`Your key ${key} was not of a recommended level - choose one of ${recommendedLevels.join(", ")}.`)
        }

        const wordChunks = [face.toString(4) + address.substring(0, firstLevels)]
        let remaining = address.substring(firstLevels)
        while (remaining.length > 0) {
            if (remaining.length > levelsPerAdditionalWord) {
                wordChunks.push(remaining.substring(0, levelsPerAdditionalWord))
                remaining = remaining.substring(levelsPerAdditionalWord)
            } else {
                wordChunks.push((remaining+"0".repeat(levelsPerAdditionalWord)).substring(0, levelsPerAdditionalWord))
                remaining = ""
            }
        }

        const phrase = wordChunks.map(chunk => wordlist[Number.parseInt(chunk, 4)])
        return phrase
    }

    function phraseToKey(phrase) {
        const wordChunks = phrase.map(word => ("0".repeat(levelsPerAdditionalWord) + wordlist.indexOf(word).toString(4)).substr(-(levelsPerAdditionalWord)))
        const firstWordChunk = "0".repeat(levelsPerAdditionalWord) + wordlist.indexOf(phrase[0]).toString(4)
        const firstWordAddress = firstWordChunk.substr(-firstLevels)
        const face = Number.parseInt(firstWordChunk.substring(0, firstWordChunk.length - firstLevels), 4)
        wordChunks[0] = firstWordAddress
        let key = `${face}/${wordChunks.join("")}`
        key = key.substring(0, Math.min(32, key.length))
        return key
    }

    function latLngToPhrase(_lat, _lng, level = defaultLevel) {
        let {lat, lng} = normaliseLatLngArgs(_lat, _lng)
        const key = S2.latLngToKey(lat, lng, level)
        return keyToPhrase(key)
    }

    function phraseToLatLng(phrase) {
        const key = phraseToKey(phrase)
        return S2.keyToLatLng(key)
    }

    function codeLatLng(_lat, _lng, level = defaultLevel) {
        let {lat, lng} = normaliseLatLngArgs(_lat, _lng)
        const key = S2.latLngToKey(lat, lng, level)
        const phrase = keyToPhrase(key)
        const decodedKey = phraseToKey(phrase)
        if (key !== decodedKey) {
            throw new Error(`Problem decoding, ${key} != ${decodedKey}`)
        }
        const decodedPosition = S2.keyToLatLng(key)
        const error = distanceFrom([lat, lng]).to([decodedPosition.lat, decodedPosition.lng])

        return {
            position: {lat, lng},
            error: error.in('m'),
            phrase,
            ...decodeKey(key)
        }
    }

    function decode(phrase) {
        const key = phraseToKey(phrase)
        const id = S2.keyToId(key)
        const idHex = dec2hex(id)
        const decodedPosition = S2.keyToLatLng(key)

        return {
            phrase,
            ...decodeKey(key)
        }
    }

    function decodeKey(key) {
        const id = S2.keyToId(key)
        const decodedPosition = S2.keyToLatLng(key)
        const idHex = dec2hex(id)

        return {
            decodedPosition,
            level: key.length - 2,
            urls: {
                google: {decoded: `https://www.google.com/maps/search/?api=1&query=${decodedPosition.lat},${decodedPosition.lng}`},
                sidewalklabs: {decoded: `https://s2.sidewalklabs.com/regioncoverer/?center=${decodedPosition.lat}%2C${decodedPosition.lng}&zoom=21&cells=${idHex}`}
            },
            checkmoji: checkmoji(key),
            S2: {
                key, id, idHex,
                corners: S2Geom.S2.S2Cell.FromHilbertQuadKey(key).getCornerLatLngs()
            },
        }
    }


    return {
        keyToPhrase, phraseToKey, latLngToPhrase, phraseToLatLng, codeLatLng, decode
    }
}

function normaliseLatLngArgs(_lat, _lng) {
    if (Array.isArray(_lat)) {
        const [lat, lng] = _lat
        return {lat, lng}
    } else if (_lat.lat) {
        return _lat
    } else {
        return {lat: _lat, lng: _lng}
    }
}