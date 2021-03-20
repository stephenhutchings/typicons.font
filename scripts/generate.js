const fs = require("fs")
const path = require("path")
const webfontsGenerator = require("webfonts-generator")

const package = require("../package.json")
const codepoints = require("./codepoints")

const dest = "./src/font/"
const tmpl = "./scripts/templates"

const files = Object.keys(codepoints).map((key) => `./src/svg/${key}.svg`)

console.log("Generating font...")
console.log(`Found ${files.length} icon declarations`)

webfontsGenerator(
  {
    files,
    dest,
    codepoints,
    classPrefix: package.className + "-",
    baseSelector: "." + package.className,
    types: ["woff2", "woff", "ttf", "svg", "eot"],
    fontName: "typicons",
    round: 10,
    ascent: 800,
    descent: 200,
    fontHeight: 1000,
    cssTemplate: path.join(tmpl, "/css.hbs"),
    html: true,
    htmlTemplate: path.join(tmpl, "/html.hbs"),
    htmlDest: path.join(dest, "demo.html"),
    templateOptions: package,
    formatOptions: {
      svg: {
        metadata: package.copyright,
        fontId: "Typicons",
      },
      ttf: {
        copyright: package.copyright,
        url: package.author.web,
        description: package.description,
      },
    },
  },
  function (error) {
    if (error) {
      console.log("An error occurred generated the files.", error)
    } else {
      console.log("Files generated successfully.")

      fs.writeFileSync(
        path.join(dest, "typicons.json"),
        JSON.stringify(codepoints, null, 2)
      )
    }
  }
)
