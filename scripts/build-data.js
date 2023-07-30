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

const getImgName = (img) => img?.match(/([^/]*$)/g)[0].toLowerCase().replace(/_/g, '-')

const extractBasicData = (el) => {
    const img = el.find("img").attr("src")
    return ({
        img,
        data: el.text().trim().split("\n"),
        imgName: getImgName(img)

    })
}

function toBase64(index) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let base64 = "";
    let i = index;

    do {
        base64 = chars[i % 64] + base64;
        i = Math.floor(i / 64);
    } while (i > 0);

    return base64;
}


const imgBasePath = "./assets/base"
const characterNames = ["Alear", "Vander", "Clanne", "Framme", "Alfred", "Etie", "Boucheron", "Celine", "Chloe", "Louis", "Jean", "Yunaka", "Anna", "Alcryst", "Citrinne", "Lapis", "Diamant", "Amber", "Jade", "Ivy", "Kagetsu", "Zelkov", "Fogado", "Pandreo", "Bunet", "Timerra", "Panette", "Merrin", "Hortensia", "Seadall", "Rosado", "Goldmary", "Lindon", "Saphir", "Mauvier", "Veyle", "Nel", "Nil", "Zelestia", "Gregory", "Madeline"]

const getCharactersData = async () => {
    const basicWeaponsSpanish = {
        Espada: "sword",
        Hacha: "axe",
        Lanza: "lance",
        Tome: "tome",
        "Puños": "arts",
        Arco: "bow",
        Daga: "knife",
        "Bastón": "staff",
        Grimorio: "tome"
    };
    const charactersData = []
    for (let i = 0; i < characterNames.length; i++) {
        const character = characterNames[i]
        try {
            const request = await axios.get(`https://www.fireemblemwod.com/fe17/personajes/${character === "Alear" ? "Avatar" : character}.htm`)
            const $ = cheerio.load(request.data)

            const cleanURL = (str) => {
                const parts = str.split('-');
                const extension = parts.pop().split('.').pop();
                return parts[0] + '.' + extension;

            }

            const img = $(".imgWH").attr("src").replace("..", "https://www.fireemblemwod.com/fe17")
            const imgName = cleanURL(getImgName(img))
            const imgPath = `${imgBasePath}/characters/big/${imgName}`
            downloadImage(img, imgPath)

            const sprite = $("td.separador.imgsprites").find("img").attr("src").replace("..", "https://www.fireemblemwod.com/fe17")
            const spriteName = getImgName(sprite)
            const spritePath = `${imgBasePath}/characters/sprites/${spriteName}`
            downloadImage(sprite, spritePath)

            const [bases, growths, modifiers] = $("table.w1acb0:eq(3) tr.bbs4").map((_, el) => {
                const data = $(el).text().trim().replace(/\t/g, "").split("\n").slice(1)
                return {
                    hp: buildNumericStat(data[0] || ""),
                    str: buildNumericStat(data[1] || ""),
                    mag: buildNumericStat(data[2] || ""),
                    dex: buildNumericStat(data[3] || ""),
                    spd: buildNumericStat(data[4] || ""),
                    def: buildNumericStat(data[5] || ""),
                    res: buildNumericStat(data[6] || ""),
                    lck: buildNumericStat(data[7] || ""),
                    con: buildNumericStat(data[8] || ""),
                }
            }).toArray()

            const initialClass = (() => {
                const data = $("td.separador.imgsprites span").text()
                if (data.includes("/")) return data.split("/")?.[0].trim()
                if (data.split("\n").length !== 2) return data.trim()
                return data.split("\n")?.[1].trim().replace(/[\(\)]/g, "")
            })()

            const initialSP = buildNumericStat($("td.separador:last").text().match(/\d+/g)?.[1])

            const capability = (() => {
                const data = $("td.separador:last").text()
                const splitString = data.split("Aptitud oculta");
                const formattedCapability = splitString[0].replace("Aptitud: ", "").trim()
                return formattedCapability in basicWeaponsSpanish ? basicWeaponsSpanish[formattedCapability] : null
            })()

            const hiddenCapabilities = (() => {
                const data = $("td.separador:last").text()
                const splitString = data.split("Aptitud oculta:");
                const formattedCapabilities = splitString[1].split("\n")[0].trim()
                if (formattedCapabilities === "--") return []
                if (!formattedCapabilities.includes(",")) return [basicWeaponsSpanish[formattedCapabilities]]
                return formattedCapabilities.split(",")
                    .map((capability) => capability.trim())
                    .map((capability) => capability in basicWeaponsSpanish ? basicWeaponsSpanish[capability] : null)
            })()

            charactersData.push({
                bases,
                growths,
                modifiers,
                initialClass,
                initialSP,
                capability,
                hiddenCapabilities,
                sprite: spritePath,
                name: character,
                img: imgPath,
                base64ID: toBase64(i)
            })
        } catch (error) {
            console.log(`error on ${character} page`, error)
        }

    }
    fs.writeFile(`./data/characters-data.json`, JSON.stringify(charactersData), () => null)

}

const emblemNames = ["Alear", "Marth", "Sigurd", "Celica", "Micaiah", "Roy", "Leif", "Lucina", "Lyn", "Ike", "Byleth", "Corrin", "Eirika", "Edelgard", "Tiki", "Hector", "Veronica", "Soren", "Camilla", "Chrome"]

for (let index = 0; index < emblemNames.length; index++) {
    const element = emblemNames[index];
    axios.get()
}

getCharactersData()

axios.get("https://serenesforest.net/engage/miscellaneous/skills/").then((html) => {
    const $ = cheerio.load(html.data)
    let skillIndex = 0
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
            const { data, img, imgName } = extractBasicData($(el))
            const bond = data[3].split(" ")
            const isInheritable = !Number.isNaN(Number(data[2]))
            const imgPath = `${imgBasePath}/${isInheritable ? "inheritable" : "syncho"}/${imgName}`
            downloadImage(img, imgPath)
            if (isInheritable)
                inheritableSkills.push({ name: data[0], description: data[1], spCost: Number(data[2]), bondLvl: Number(bond[3]), emblem: bond[0], img: imgPath, base64ID: toBase64(skillIndex) })
            else synchoSkills.push({ name: data[0], description: data[1], emblem: bond[0], img: imgPath, base64ID: toBase64(skillIndex) })
        })
    }

    const personalSkilsStartingIndex = 3


    for (let index = personalSkilsStartingIndex; index <= personalSkilsStartingIndex + 1; index++) {
        const realIndex = index === personalSkilsStartingIndex ? personalSkilsStartingIndex : personalSkilsStartingIndex + 6
        $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
            const { data, img, imgName } = extractBasicData($(el))
            const imgPath = `${imgBasePath}/personal/${imgName}`
            downloadImage(img, imgPath)
            personalSkills.push({ name: data[0], description: data[1], character: data[2], img: imgPath })
        })
    }

    const classSkilsStartingIndex = 4

    for (let index = classSkilsStartingIndex; index <= classSkilsStartingIndex + 1; index++) {
        const realIndex = index === classSkilsStartingIndex ? classSkilsStartingIndex : classSkilsStartingIndex + 6
        $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
            const { data, img, imgName } = extractBasicData($(el))
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
    $("table tr:not(:first)").each((_, el) => {
        const { data, img, imgName } = extractBasicData($(el))

        if (data[1] !== "Emblem") {
            const parsedImgName = imgName.replace("engrave-", "")
            const imgPath = `${imgBasePath}/engravings/${parsedImgName}`
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

const basicWeapons = ["swords", "lances", "axes", "bows", "knives", "tomes", "arts"]

for (const weapon of basicWeapons) {
    axios.get(`https://serenesforest.net/engage/weapons-items/${weapon}/`).then((html) => {
        const $ = cheerio.load(html.data)
        const list = []
        $("table tr").each((_, el) => {
            const { data, img, imgName } = extractBasicData($(el))

            if (data[0] !== "Icon") {
                const imgPath = `${imgBasePath}/weapons/${weapon}/${imgName}`
                downloadImage(img, imgPath)
                list.push({
                    name: data[0],
                    mt: buildNumericStat(data[1]),
                    hit: buildNumericStat(data[2]),
                    crit: buildNumericStat(data[3]),
                    wt: buildNumericStat(data[4]),
                    rng: buildNumericStat(data[5]),
                    lvl: buildNumericStat(data[6]),
                    price: buildNumericStat(data[7]),
                    description: data[8],
                    isEngageWeapon: data[8].includes("wielded by Emblem"),
                    img: imgPath
                })
            }

        })

        fs.writeFile(`./data/${weapon}.json`, JSON.stringify(list), () => null)
    })
}




