import {sowpods} from "./sowpods-words.js"

const scrabbleDict = new Set(sowpods)

export function isInScrabbleDict(word) {
    return scrabbleDict.has(word.toUpperCase())
}