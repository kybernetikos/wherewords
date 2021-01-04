import phonetic from "phonetic-english"

export function homophones(dict) {
    const translator = new phonetic.Translator()
    const phoneticWords = new Map()

    for (let word of dict) {
        const pp = translator.translate(word)
        if (!phoneticWords.has(pp)) {
            phoneticWords.set(pp, [])
        }
        phoneticWords.get(pp).push(word)
    }

    return new Set(Array.from(phoneticWords.entries())
        .filter(([cp, words]) => words.length > 1)
        .flatMap(([cp, words]) => words)
    )
}