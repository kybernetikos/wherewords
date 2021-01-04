import syllable from "syllable"
import {bannedwords} from "../bannedwords/facebook.js"
import {isInScrabbleDict} from "../sowpods/scrabbledict.js"
import {hasHomophones, knownPronunciation, hasMultiplePronunciations} from "../cmu-pronunciation/pronounce.js"
import {knownBadSentiment} from "../sentiment/wordsentiment.js"
import {homophones} from "./phonetic-pronunciation.js"

export const DEFAULT_FILTERS = {
    scrabbleDict: false, cmuHomophones: false, phoneticHomophones: true, syllableCount: false,
    bannedWords: true, sentiment: 0, knownPronunciationTo: 6, multiplePronunciations: false,
    minLength: 2, maxLength: 12, noSuffixes: false, sort: true
}

export function filterWordlist(dict, test = DEFAULT_FILTERS) {
    const phoneticHomophones = homophones(dict)

    const filtered = dict.filter((word) => true
        && (!test.scrabbleDict           || isInScrabbleDict(word))
        && (!test.cmuHomophones          || !hasHomophones(word))
        && (!test.phoneticHomophones     || !phoneticHomophones.has(word))
        && (!test.syllableCount          || syllable(word) < test.syllableCount)
        && (!test.bannedWords            || !bannedwords.has(word))
        && (test.sentiment === undefined || !knownBadSentiment(word, test.sentiment))
        && (!test.knownPronunciationTo   || knownPronunciation(word) || word.length > test.knownPronunciationTo)
        && (!test.multiplePronunciations || !hasMultiplePronunciations(word))
        && (!test.minLength              || word.length >= test.minLength)
        && (!test.maxLength              || word.length <= test.maxLength)
    )

    let result = filtered

    if (test.noSuffixes) {
        const filteredSet = new Set(filtered)
        result = filtered.filter(word => !filteredSet.has(word.substring(0, word.length - 1)))
    }

    if (test.sort) {
        result = result.sort((a, b) => a === b ? 0 : (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
    }

    return result
}
