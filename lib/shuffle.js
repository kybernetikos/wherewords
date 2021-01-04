import {prng_alea} from 'esm-seedrandom'

let default_rnd = prng_alea("default")

export function setSeed(newSeed, opts) {
    default_rnd = prng_alea(newSeed, opts)
}

export function random() {
    return default_rnd
}

export function shuffle(data, _rndOrSeed = default_rnd) {
    const rnd = typeof _rndOrSeed === 'function' ? _rndOrSeed : prng_alea(_rndOrSeed)
    const result = data.slice()
    for (let bottom = result.length - 1; bottom >= 0; --bottom) {
        const replacer = Math.floor(rnd() * bottom)
        const originalItem = result[bottom]
        result[bottom] = result[replacer]
        result[replacer] = originalItem
    }

    return result
}