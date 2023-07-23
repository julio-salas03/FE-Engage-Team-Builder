const cheerio = require("cheerio")
const axios = require("axios")
const fs = require("fs")


const downloadImage = (url, image_path) => {
    if (fs.existsSync(image_path)) return
    return axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(image_path))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            }),
    );
}

const buildNumericStat = (stat) => {
    if (typeof stat !== "string") throw new Error(`buildNumericStat expects stat parameter to be a string. ${typeof stat} provided`)
    const numberStat = Number(stat)
    return !Number.isNaN(numberStat) ? numberStat : 0
}

const getImgName = (img) => img.match(/([^/]*$)/g)[0].toLowerCase().replace(/_/g, '-')


axios.get("https://serenesforest.net/engage/miscellaneous/skills/").then((html) => {
    const $ = cheerio.load(html.data)
    const inheritableSkills = []
    const synchoSkills = []
    const personalSkills = []
    const classSkills = []
    const imgBasePath = "./assets/base/skills"



    for (let index = 1; index <= 4; index++) {
        /**
         * This allows to retreive the dlc emblems data
         */
        const realIndex = index > 2 ? index + 4 : index
        $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
            const data = $(el).text().trim().split("\n")
            const img = $(el).find("img").attr("src")
            const bond = data[3].split(" ")
            const imgName = getImgName(img)
            const isInheritable = !Number.isNaN(Number(data[2]))
            const imgPath = `${imgBasePath}/${isInheritable ? "inheritable" : "syncho"}/${imgName}`
            downloadImage(img, imgPath)
            if (isInheritable)
                inheritableSkills.push({ name: data[0], description: data[1], spCost: Number(data[2]), bondLvl: Number(bond[3]), emblem: bond[0], img: imgPath })
            else synchoSkills.push({ name: data[0], description: data[1], emblem: bond[0], img: imgPath })
        })
    }

    const personalSkilsStartingIndex = 3


    for (let index = personalSkilsStartingIndex; index <= personalSkilsStartingIndex + 1; index++) {
        const realIndex = index === personalSkilsStartingIndex ? personalSkilsStartingIndex : personalSkilsStartingIndex + 6
        $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
            const data = $(el).text().trim().split("\n")
            const img = $(el).find("img").attr("src")
            const imgName = getImgName(img)
            const imgPath = `${imgBasePath}/personal/${imgName}`
            downloadImage(img, imgPath)
            personalSkills.push({ name: data[0], description: data[1], character: data[2], img: imgPath })
        })
    }

    const classSkilsStartingIndex = 4

    for (let index = classSkilsStartingIndex; index <= classSkilsStartingIndex + 1; index++) {
        const realIndex = index === classSkilsStartingIndex ? classSkilsStartingIndex : classSkilsStartingIndex + 6
        $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
            const data = $(el).text().trim().split("\n")
            const img = $(el).find("img").attr("src")
            const imgName = getImgName(img)
            const imgPath = `${imgBasePath}/class/${imgName}`
            downloadImage(img, imgPath)
            classSkills.push({ name: data[0], description: data[1], class: data[2], img: imgPath })
        })
    }

    fs.writeFile("./data/personal-skills.json", JSON.stringify(personalSkills), () => null)
    fs.writeFile("./data/class-skills.json", JSON.stringify(classSkills), () => null)
    fs.writeFile("./data/inheritable-skills.json", JSON.stringify(inheritableSkills), () => null)
    fs.writeFile("./data/syncho-skills.json", JSON.stringify(synchoSkills), () => null)
})

axios.get("https://serenesforest.net/engage/somniel/engraving/").then((html) => {
    const $ = cheerio.load(html.data)
    const engravings = []
    const imgBasePath = "./assets/base"
    $("table tr:not(:first)").each((_, el) => {
        const data = $(el).text().trim().split("\n")
        if (data[1] !== "Emblem") {
            const img = $(el).find("img").attr("src")
            const imgName = getImgName(img)?.replace("engrave-", "")
            const imgPath = `${imgBasePath}/engravings/${imgName}`
            downloadImage(img, imgPath)
            engravings.push({
                name: data[1],
                emblem: data[0],
                mt: buildNumericStat(data[2]),
                hit: buildNumericStat(data[3]),
                crit: buildNumericStat(data[4]),
                wt: buildNumericStat(data[5]),
                avo: buildNumericStat(data[6]),
                ddg: buildNumericStat(data[7]),
                img: imgPath
            })
        }

    })
    fs.writeFile("./data/engravings.json", JSON.stringify(engravings), () => null)
})