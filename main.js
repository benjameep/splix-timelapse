var nightmare = require('night-map')(require('nightmare'))({
    show: true,
    typeInterval: 250
})
var imageSaver = new(require('image-saver-nodejs/lib'))()
var deathCount = 0

function start() {
    nightmare
        .goto("http://splix.io/#sheep")
        .insert("#nameInput", "Definitely not a bot")
        .click("#joinButton")
        .wait("#miniMap[style]")
        .then(() => {
            return loop(nightmare, 0)
        })
}

function loop(nightmare, num) {
    return nightmare
        .map(() =>
            nightmare
            .type("body", "awdsawds")
            .evaluate(() => ({
                    err: document.getElementById("mainCanvas").style.display == "none",
                    url: document.getElementById("minimapCanvas").toDataURL()
            }))
            , Array(5).fill(0))
        .then(arr => {
            if(arr.some(obj => obj.err)){
                console.log("Death Count: "+ ++deathCount)
                return restart(nightmare, num)
            }
            arr.forEach((obj, i) => {
                imageSaver.saveFile("lapse/" + (num * 10 + i) + ".png", obj.url.split(',')[1])
            })
            return loop(nightmare, num + 1)
        })
}

function restart(nightmare, num) {
    return nightmare
        .click("#joinButton")
        .wait("#miniMap[style]")
        .then(() => {
            return loop(nightmare, num)
        })
}

start()
