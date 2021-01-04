export const checkmojis = ("😂 😭 ❤ 🤣 😍 😌 🔥 🤔 😫 🙏 💕 😲 👍 👌 😩 😏 😁 😳 🙌 💁 🙈 🙉 🙊 😎 ✌️ " +
    "😑 🎵 👀 ✋ 😴 👏 💯 😱 💔 👊 😤 👿 ✔️ 👋 ☀️ 🌹 🌸 ✨ 🎉 😬 💘 👎 🎧 ✊ 💀 🤲 👑 ♻️ ✌️ 👉 👈 😇 ⚽ " +
    "🍾 🥂 🍀 🎈").split(" ")

function hash(string) {
    let result = 0
    for (let i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i)
        result  = ((result << 5) - result) + charCode
        result = result >>>0
    }
    return result
}

export function checkmoji(string) {
    const h = hash(string)
    return checkmojis[h % checkmojis.length]
}