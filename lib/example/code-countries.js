import {wordlist} from "../wordlist/12bits-oc.js"
import {fromWordList} from "../geocode.js"
import {shuffle} from "../shuffle.js"
import {countries} from "./countries.js"

function trySeed(seed, statsOnly) {
    // const {codeLatLng} = fromWordList(shuffle(oxford5k, seed))
    const {codeLatLng} = fromWordList(shuffle(wordlist, seed))

    const pad = (text, size) => (text + " ".repeat(size)).substring(0, size)

    function check(name, [lat, lng], stats, level = 22) {
        const result = codeLatLng(lat, lng, level)
        if (result.phrase[0].length > stats.longestFirstWord.length) {
            stats.longestFirstWord = result.phrase[0]
        }
        if (!statsOnly) {
            console.log(pad(name, 35), `${pad(result.phrase.join(" "), 45)}`, (Math.floor(result.error*1000)/1000)+"m")
        }
    }

    const stats = {longestFirstWord: "", worstFirstWord: ""}
    for (let country of countries) {
        check(country.name.common, country.latlng, stats)
    }

    console.log(seed, stats, stats.longestFirstWord.length)
    return {seed, length: stats.longestFirstWord.length}
}

// let bestSoFar = null
// const bests = []
// for (let seed of bip39) {
//     const candidate = trySeed(seed, true)
//     if (bestSoFar == null || bestSoFar.length >= candidate.length) {
//         bestSoFar = candidate
//         bests.push(candidate)
//     }
// }
// console.log(bests.reverse())

trySeed("upon", false)
