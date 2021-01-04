import {readFileSync, writeFileSync} from "fs"
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

const thisDir = dirname(fileURLToPath(import.meta.url));
const dict = readFileSync(resolve(thisDir, "cmudict-07b.txt"), "utf8")
    .split(/\r?\n/)
    .filter(line => line.indexOf(';;;') !== 0)
    .map(line => {
        const [word, ...pronunciation] = line.split(/ +/)
        return {word, pronunciation}
    })

const wordsByPronunciations = new Map()
const pronunciationsByWord = new Map()
for (let {word, pronunciation} of dict) {
    const w = word.replace(/\(\d+\)/g, "")
    const p = pronunciation.join("-")
    if (!pronunciationsByWord.has(w)) {
        pronunciationsByWord.set(w, [])
    }
    if (!wordsByPronunciations.has(p)) {
        wordsByPronunciations.set(p, [])
    }
    pronunciationsByWord.get(w).push(p)
    wordsByPronunciations.get(p).push(w)
}

console.log(dict.length)
console.log(wordsByPronunciations.size, pronunciationsByWord.size)

const wordsByPronunciationJson = Object.fromEntries(wordsByPronunciations.entries())
const pronunciationsByWordJson = Object.fromEntries(pronunciationsByWord.entries())

writeFileSync(resolve(thisDir, "cmu-07b-pronunciation.js"), "export const pronunciations = " + JSON.stringify(
    {byWord: pronunciationsByWordJson, byPronunciation: wordsByPronunciationJson}, null, "  ")
)



