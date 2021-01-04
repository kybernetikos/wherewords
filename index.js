import {fromWordList} from "./lib/geocode.js"
import {shuffle} from "./lib/shuffle.js"
import {wordlist as wordlist12Bit} from "./lib/wordlist/12bits-oc-v1.1.js"
import {nato} from "./lib/wordlist/5bits-nato.js"
import {bip39} from "./lib/wordlist/11bits-bip39.js"


export const wordlist = wordlist12Bit

export const {
    keyToPhrase, phraseToKey, latLngToPhrase, phraseToLatLng, codeLatLng, decode
} = fromWordList(shuffle(wordlist, "upon"))

export const alt = {
    nato: fromWordList(nato), bip39: fromWordList(bip39)
}

/*
    level 22 is good => 44 + 3 = 47 bits
    about 2.5x2.5m at most

    4 words with a 12 bit wordlist
    3 words with a 16 bit wordlist
 */
