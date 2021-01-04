import {pronunciations} from "./cmu-07b-pronunciation.js"

const homophones = new Set(Array.from(Object.entries(pronunciations.byPronunciation))
    .filter(([pronunciation, words]) => words.length > 1)
    .flatMap(([pronunciation, words]) => words))

export function knownPronunciation(word) {
    return pronunciations.byWord[word.toUpperCase()] !== undefined
}

export function hasHomophones(word) {
    return homophones.has(word.toUpperCase())
}

export function hasMultiplePronunciations(word) {
    const p = pronunciations.byWord[word.toUpperCase()]
    return p !== undefined ? p.length > 1 : false
}

export function pronounced(word) {
    const p = pronunciations.byWord[word.toUpperCase()]
    return p !== undefined ? p.map(p => p.split("-")) : undefined
}

export function spelled(pronounced) {
    const p = Array.isArray(pronounced) ? pronounced.join("-") : pronounced
    return pronunciations.byPronunciation[p]
}