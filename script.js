import * as rainbow from "./utils/rainbow_text.js";

const main = document.querySelector("main");
const input = document.querySelector("textarea");
const output = document.querySelector(".output");
const preview = document.querySelector(".preview");
const toggleOptions = document.querySelector(".toggle-options");
const rotateHueOutput = document.querySelector("#rotate_hue_output");
const hueScaleOutput = document.querySelector("#hue_scale_output");

const options = {
  shortenOutput: document.querySelector("#shorten_output"),
  outputHTML: document.querySelector("#output_html"),
  rotateHue: document.querySelector("#rotate_hue"),
  hueScale: document.querySelector("#hue_scale")
};

const nullish = (val, or) => (val != null ? val : or);
const nanish = (val, or) => (!isNaN(val) ? val : or);

const updatePreview = () => {
  const colorizeOptions = {
    compress: options.shortenOutput.checked,
    hue: nanish(parseInt(options.rotateHue.value, 10)),
    scale: nanish(parseFloat(options.hueScale.value))
  };

  output.firstChild.value = options.outputHTML.checked
    ? rainbow
        .colorizeHTML(input.value, colorizeOptions)
        .map(v => v.outerHTML)
        .join("")
    : rainbow.colorize(input.value, colorizeOptions);
  preview.innerHTML = "";
  preview.append(...rainbow.colorizeHTML(input.value, colorizeOptions));
};

input.addEventListener("input", updatePreview);
options.shortenOutput.addEventListener("input", updatePreview);
options.outputHTML.addEventListener("input", updatePreview);
options.rotateHue.addEventListener("input", ev => {
  updatePreview();
  rotateHueOutput.value = ev.currentTarget.value;
});
options.hueScale.addEventListener("input", ev => {
  updatePreview();
  hueScaleOutput.value = ev.currentTarget.value;
});

let classes = main.classList;
toggleOptions.addEventListener("click", () => {
  classes.toggle("options-enabled");
});

updatePreview();
