import {englishwords} from "../dwyl-english-words-alpha.js"
import verbalId from "verbal-id"
import {filterWordlist} from "./filter.js"
import {writeFileSync} from "fs"
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'
import {includeWords, excludeWords} from "./exception-words.js"

const excludeWordSet = new Set(excludeWords)

const startWordList = Array.from(new Set([...englishwords, ...includeWords, ...verbalId.words]))

// for a 16 bit wordlist, we need at least 65536 words

const wordlist = filterWordlist(startWordList, {
    scrabbleDict: false, cmuHomophones: true, phoneticHomophones: true, syllableCount: 4,
    bannedWords: true, sentiment: 0, knownPronunciationTo: 8, multiplePronunciations: true,
    minLength: 2, maxLength: 12, noSuffixes: true, sort: true
}).filter(word => !excludeWordSet.has(word))

console.log(startWordList.length, "->", wordlist.length)

const thisDir = dirname(fileURLToPath(import.meta.url));
writeFileSync(resolve(thisDir, "filtered-wordlist-16.js"), "export const wordlist = " + JSON.stringify(
    wordlist, null, "  "
))
