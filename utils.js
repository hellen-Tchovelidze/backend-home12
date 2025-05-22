const fs = require('fs/promises')

const readFile = async (filePath, parse) => {
    if(!filePath) return
    const readData = await fs.readFile(filePath, 'utf-8')

    return parse ? JSON.parse(readData) : readData
}   

const writeFile = async (filePath, data) => {
    if(!filePath) return
    await fs.writeFile(filePath, data)
}  

module.exports = {writeFile, readFile}