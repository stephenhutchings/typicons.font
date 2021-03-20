const package = require("./package.json")
const codepoints = require("./scripts/codepoints")

const copyright = "(c) Stephen Hutchings 2012-2021"

module.exports = {
  inputDir: "./src/svg",
  outputDir: "./dist",
  fontTypes: ["ttf", "woff", "woff2", "svg", "eot"],
  assetTypes: ["ts", "css", "json", "html"],
  fontsUrl: "",
  name: "typicons",
  prefix: "typcn",
  tag: "span",
  selector: ".typcn",
  formatOptions: {
    svg: {
      fontId: "Typicons",
      fontHeight: 1000,
      ascent: 800,
      descent: 200,
      round: 1,
      metadata: copyright,
    },
    json: {
      indent: 2,
    },
    // woff: {
    //   metadata: {
    //     description: package.description,
    //     vendor: package.author.web,
    //     credits: package.author.name,
    //     copyright,
    //   },
    // },
    html: package,
    ttf: {
      copyright,
      url: package.author.web,
      description: package.description,
      ts: undefined,
    },
  },
  templates: {
    css: "./src/demo/css.hbs",
    html: "./src/demo/html.hbs",
  },
  pathOptions: {
    html: "./dist/demo.html",
  },
  codepoints,
}
