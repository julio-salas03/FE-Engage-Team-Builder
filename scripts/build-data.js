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

axios.get("https://serenesforest.net/engage/miscellaneous/skills/").then((html) => {
    const $ = cheerio.load(html.data)
    const inheritableSkills = []
    const synchoSkills = []
    const personalSkills = []
    const classSkills = []
    const imgBasePath = "./assets/base/skills"


    const getImgName = (img) => img.match(/([^/]*$)/g)[0].toLowerCase().replace(/_/g, '-')

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

    for (let index = 3; index <= 4; index++) {
        const realIndex = index === 3 ? 3 : 3 + 6
        $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
            const data = $(el).text().trim().split("\n")
            const img = $(el).find("img").attr("src")
            const imgName = getImgName(img)
            const imgPath = `${imgBasePath}/personal/${imgName}`
            downloadImage(img, imgPath)
            personalSkills.push({ name: data[0], description: data[1], character: data[2], img: imgPath })
        })
    }

    $(`table:eq(4)`).find("tr:not(:first)").each((_, el) => {
        const data = $(el).text().trim().split("\n")
        const img = $(el).find("img").attr("src")
        const imgName = getImgName(img)
        const imgPath = `${imgBasePath}/class/${imgName}`
        downloadImage(img, imgPath)
        classSkills.push({ name: data[0], description: data[1], class: data[2], img: imgPath })
    })

    fs.writeFile("./data/personal-skills.json", JSON.stringify(personalSkills), () => null)
    fs.writeFile("./data/class-skills.json", JSON.stringify(classSkills), () => null)
    fs.writeFile("./data/inheritable-skills.json", JSON.stringify(inheritableSkills), () => null)
    fs.writeFile("./data/syncho-skills.json", JSON.stringify(synchoSkills), () => null)
})