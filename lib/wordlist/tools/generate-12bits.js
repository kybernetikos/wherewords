import {oxford5k} from "../oxford5k.js"
import verbalId from "verbal-id"
import {filterWordlist} from "./filter.js"
import {writeFileSync} from "fs"
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'
import {includeWords, excludeWords} from "./exception-words.js"

const excludeWordSet = new Set(excludeWords)

const initialWordList = Array.from(new Set([...oxford5k, ...includeWords, ...verbalId.words]))

const wordlist = filterWordlist(initialWordList, {
    scrabbleDict: false, cmuHomophones: false, phoneticHomophones: true, syllableCount: false,
    bannedWords: true, sentiment: 0, knownPronunciationTo: 6, multiplePronunciations: false,
    minLength: 2, maxLength: 12, noSuffixes: false, sort: true
}).filter(word => !excludeWordSet.has(word))

const wordlistSet = new Set(wordlist)

const oldWords = new Set(oxford5k)
const newWords = wordlist.filter(word => !oldWords.has(word))
const removedWords = oxford5k.filter(word => !wordlistSet.has(word))

console.log(initialWordList.length, "->", wordlist.length, wordlist.length - 2**12, "extra")

const thisDir = dirname(fileURLToPath(import.meta.url));
writeFileSync(resolve(thisDir, "filtered-wordlist-12bits.js"), "export const wordlist = " + JSON.stringify(
    wordlist, null, "  "
))