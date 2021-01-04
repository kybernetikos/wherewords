import {afinn111} from "./afinn111.js"

export function knownBadSentiment(word, cutoff = -1) {
    return Number(afinn111[word.toLowerCase()]) < cutoff
}
