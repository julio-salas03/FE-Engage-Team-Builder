const cheerio = require("cheerio")
const axios = require("axios")
const fs = require("fs")
const path = require('path');
const sharp = require('sharp');

const purgeFileURL = (file) => {
    return file.replace("/public", "").replace(/\.\w+/g, ".png")
}

const getImgName = (img) => img?.match(/([^/]*$)/g)[0].toLowerCase().replace(/_/g, '-')

const ensureDirectoryExistence = async (filePath) => {
    try {
        const dirname = path.dirname(filePath);
        if (!fs.existsSync(dirname)) {
            await ensureDirectoryExistence(dirname);
            await fs.promises.mkdir(dirname);
        }
        return true
    } catch (error) {
        // TODO: handle this error
        return true
    }

};

const downloadImage = async (url, base_image_path) => {
    if (fs.existsSync(base_image_path)) return;

    await ensureDirectoryExistence(base_image_path);

    const response = await axios({
        url,
        responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(response.data, 'binary');

    const baseNameWithoutExt = path.basename(base_image_path, path.extname(base_image_path));
    const dirName = path.dirname(base_image_path);

    const saveImage = async (format) => {
        const outputPath = path.join(dirName, `${baseNameWithoutExt}.${format}`);
        await sharp(imageBuffer)
            .toFile(outputPath, (err, info) => {
                if (err) throw err;
            });
    };

    await Promise.all([
        saveImage('png'),
        saveImage('avif'),
        saveImage('webp')
    ]);
};

const buildNumericStat = (stat) => {
    if (typeof stat !== "string") throw new Error(`buildNumericStat expects stat parameter to be a string. ${typeof stat} provided`)
    const numberStat = Number(stat)
    return !Number.isNaN(numberStat) ? numberStat : 0
}

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

function createEngageAttackUnitTypeModifier(s) {
    const pattern = /\[(.*?)\](.*)/;
    const matches = s.match(pattern);

    if (matches && matches.length > 2) {
        const unitType = matches[1].trim();
        const effect = matches[2].trim();
        return {
            unitType,
            effect
        };
    } else {
        return null;
    }
}
const addMissingStats = (statsObj, base = 0) => {
    const allStats = ["hp", "str", "mag", "dex", "spd", "def", "res", "lck", "con", "mov"].map((stat) => [stat, base])
    return { ...Object.fromEntries(allStats), ...statsObj }
}
function normalizeName(name) {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

const imgBasePath = "./public/images"

const init = async () => {

    const inheritableSkills = []
    const synchoSkills = []
    const personalSkills = []
    const classSkills = []

    await axios.get("https://serenesforest.net/engage/miscellaneous/skills/").then((html) => {
        const $ = cheerio.load(html.data)
        for (let index = 1; index <= 4; index++) {
            /**
             * This allows to retrieve the dlc emblems data
             */
            const realIndex = index > 2 ? index + 4 : index
            $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
                const { data, img, imgName } = extractBasicData($(el))
                const bond = data[3].split(" ")
                const isInheritable = !Number.isNaN(Number(data[2]))
                const imgPath = `${imgBasePath}/skills/${isInheritable ? "inheritable" : "syncho"}/${imgName}`
                downloadImage(img, imgPath)
                if (isInheritable)
                    inheritableSkills.push({ name: data[0], description: data[1], spCost: Number(data[2]), bondLvl: Number(bond[3]), emblem: bond[0], img: purgeFileURL(imgPath), base64ID: toBase64(0) })
                else synchoSkills.push({ name: data[0], description: data[1], emblem: bond[0], img: purgeFileURL(imgPath), base64ID: toBase64(0) })
            })
        }

        const personalSkillsStartingIndex = 3


        for (let index = personalSkillsStartingIndex; index <= personalSkillsStartingIndex + 1; index++) {
            const realIndex = index === personalSkillsStartingIndex ? personalSkillsStartingIndex : personalSkillsStartingIndex + 6
            $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
                const { data, img, imgName } = extractBasicData($(el))
                const imgPath = `${imgBasePath}/skills/personal/${imgName}`
                downloadImage(img, imgPath)
                personalSkills.push({ name: normalizeName(data[0]), description: data[1], character: data[2], img: purgeFileURL(imgPath) })
            })
        }

        const classSkillsStartingIndex = 4

        for (let index = classSkillsStartingIndex; index <= classSkillsStartingIndex + 1; index++) {
            const realIndex = index === classSkillsStartingIndex ? classSkillsStartingIndex : classSkillsStartingIndex + 6
            $(`table:eq(${realIndex})`).find("tr:not(:first)").each((_, el) => {
                const { data, img, imgName } = extractBasicData($(el))
                const imgPath = `${imgBasePath}/skills/class/${imgName}`
                downloadImage(img, imgPath)
                classSkills.push({ name: data[0], description: data[1], class: data[2], img: purgeFileURL(imgPath) })
            })
        }
    })

    const charactersData = []
    const characterNames = ["Alear", "Vander", "Clanne", "Framme", "Alfred", "Etie", "Boucheron", "Celine", "Chloe", "Louis", "Jean", "Yunaka", "Anna", "Alcryst", "Citrinne", "Lapis", "Diamant", "Amber", "Jade", "Ivy", "Kagetsu", "Zelkov", "Fogado", "Pandreo", "Bunet", "Timerra", "Panette", "Merrin", "Hortensia", "Seadall", "Rosado", "Goldmary", "Lindon", "Saphir", "Mauvier", "Veyle", "Nel", "Nil", "Zelestia", "Gregory", "Madeline"]
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
            const { character: _, ...personalSkill } = personalSkills.find((skill) => normalizeName(skill.character) === character)
            charactersData.push({
                bases,
                growths,
                modifiers,
                initialClass,
                initialSP,
                capability,
                hiddenCapabilities,
                personalSkill,
                sprite: purgeFileURL(spritePath),
                name: character,
                img: purgeFileURL(imgPath),
                base64ID: toBase64(i),
            })
        } catch (error) {
            console.log(`error on ${character} page`, error)
        }
    }

    const weaponsUpgrades = []

    await axios.get("https://serenesforest.net/engage/somniel/forging/").then((html) => {
        const $ = cheerio.load(html.data)
        $("table tr").each((_, el) => {
            const data = $(el).text().trim().split("\n")
            if (!data[0].includes("+") || data[0].includes("New Weapon")) return
            const [weaponName, upgradeLvl] = data[0].split("+")
            const materials = data[5].trim().split(",")

            weaponsUpgrades.push({
                weaponName,
                upgradeLvl: Number(upgradeLvl),
                mt: buildNumericStat(data[1]),
                hit: buildNumericStat(data[2]),
                crit: buildNumericStat(data[3]),
                wt: buildNumericStat(data[4]),
                materials: materials.reduce((acc, curr) => {
                    const [material, , amount] = curr.split(" ")
                    if (!material) return acc
                    return { ...acc, [material.toLowerCase()]: Number(amount.replace("x", "")) }
                }, {}),
                price: buildNumericStat(data[6]),
            })
        })
    })

    const weaponTypes = ["swords", "lances", "axes", "bows", "knives", "tomes", "arts"]
    const weapons = []
    const allEngageWeapons = []


    for (const weaponType of weaponTypes) {
        await axios.get(`https://serenesforest.net/engage/weapons-items/${weaponType}/`).then((html) => {
            const $ = cheerio.load(html.data)
            $("table tr").each((_, el) => {
                const { data, img, imgName } = extractBasicData($(el))
                if (data[0] === "Icon" || data[0].match(/[\(\)]+/)) return
                const imgPath = `${imgBasePath}/weapons/${weaponType}/${imgName}`
                downloadImage(img, imgPath)
                const base64ID = toBase64(weapons.length)
                const weapon = {
                    name: data[0],
                    mt: buildNumericStat(data[1]),
                    hit: buildNumericStat(data[2]),
                    crit: buildNumericStat(data[3]),
                    wt: buildNumericStat(data[4]),
                    rng: buildNumericStat(data[5]),
                    lvl: buildNumericStat(data[6]),
                    price: buildNumericStat(data[7]),
                    description: data[8],
                    img: purgeFileURL(imgPath),
                    type: weaponType,
                }
                if (data[8].includes("wielded by Emblem") || data[8].includes("of Emblem")) return allEngageWeapons.push(weapon)
                const weaponUpgrades = weaponsUpgrades.filter((upgrade) => upgrade.weaponName === data[0])

                weapons.push({
                    ...weapon,
                    base64ID: base64ID.length < 2 ? "A" + base64ID : base64ID,
                    weaponUpgrades: weaponUpgrades.map(({ weaponName, upgradeLvl, ...upgradeData }) => upgradeData),
                })
            })

        })
    }

    const emblemNames = ["Alear", "Marth", "Sigurd", "Celica", "Micaiah", "Roy", "Leif", "Lucina", "Lyn", "Ike", "Byleth", "Corrin", "Eirika", "Edelgard", "Tiki", "Hector", "Veronica", "Soren", "Camilla", "Chrom"]
    const emblems = []

    for (let index = 0; index < emblemNames.length; index++) {
        const emblem = emblemNames[index];
        const request = await axios.get(`https://serenesforest.net/engage/emblems/${emblem.toLowerCase()}/`)
        const $ = cheerio.load(request.data)
        const weaponProficiencies = []
        let engageAttack = { base: null, link: null }
        const engageWeapons = []

        const statsModifiersNames = $("table:first tr th:not(:first)").toArray().map((el) => $(el).text().toLowerCase().replace("\n", ""))
        const statsModifiers = $("table:first tr:last td:not(:first)").toArray().map((el) => Number($(el).text()))
        const fullModifiers = statsModifiersNames.map((statName, i) => [statName, statsModifiers[i]])

        $("table:last tr").each((_, el) => {
            const data = $(el).text().trim().split("\n").slice(1)

            if (data[0].includes("Prof")) return weaponProficiencies.push(data[0].toLowerCase().split(" ")[0])

            if (data[2].includes("Engage Attack")) {
                const attackPartner = data[2].includes("adjacent") ? data[2].split(" ").slice(-1)[0].replace(")", "") : null
                const [description, ...unitTypeModifiers] = data[1].split(/(?=\[[^\]]+\])/)
                return attackPartner
                    ? engageAttack.link = { attackPartner, description }
                    : engageAttack.base = {
                        name: data[0],
                        description,
                        unitTypeModifiers: unitTypeModifiers.map(createEngageAttackUnitTypeModifier)
                    }
            }

            if (data[2] === "Engage Weapon") {
                const foundWeapon = allEngageWeapons.find((weapon) => weapon.name === data[0])
                if (foundWeapon) engageWeapons.push(foundWeapon)
            }
        })
        const img = $("img").map((_, el) => $(el).attr("src")).toArray().filter((url) => url.includes(emblem.toLocaleLowerCase()))[0]
        const imgName = img ? getImgName(img) : ""
        const imgPath = `${imgBasePath}/emblems/${imgName}`
        if (img) downloadImage(img, imgPath)

        emblems.push({
            weaponProficiencies,
            engageAttack,
            engageWeapons,
            name: emblem,
            base64ID: toBase64(index),
            statsModifiers: addMissingStats(Object.fromEntries(fullModifiers)),
            img: img ? purgeFileURL(imgPath) : ""
        })
    }

    const engravings = []

    await axios.get("https://serenesforest.net/engage/somniel/engraving/").then((html) => {
        const $ = cheerio.load(html.data)
        $("table tr:not(:first)").each((i, el) => {
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
                    img: purgeFileURL(imgPath),
                    base64ID: toBase64(i)
                })
            }

        })
    })

    fs.writeFile(`./data/characters.json`, JSON.stringify(charactersData), () => null)
    fs.writeFile(`./data/emblems.json`, JSON.stringify(emblems), () => null)
    fs.writeFile(`./data/weapons.json`, JSON.stringify(weapons), () => null)
    fs.writeFile("./data/engravings.json", JSON.stringify(engravings), () => null)
    fs.writeFile("./data/class-skills.json", JSON.stringify(classSkills), () => null)
    fs.writeFile("./data/inheritable-skills.json", JSON.stringify(inheritableSkills), () => null)
    fs.writeFile("./data/syncho-skills.json", JSON.stringify(synchoSkills), () => null)

}

init()