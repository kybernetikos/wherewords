import wordnets from "en-wordnet"
import enDict from "en-dictionary"

const start = async () => {
    const Dictionary = enDict.default
    console.log('wordnet', wordnets.default)
    const dictionary = new Dictionary(wordnets.default.get("3.1"))
    await dictionary.init()

    const result = dictionary.searchFor(["preposterous"])
    console.log(result.get("preposterous"))
    const simple = dictionary.searchSimpleFor(["preposterous"])
    console.log(simple.get("preposterous"))
};
start();