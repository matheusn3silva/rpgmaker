const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function generateCode() {
    const part = () => 
        Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')
    
    return `${part()}-${part()}`
}

module.exports = { generateCode }