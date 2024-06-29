const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function hsl2rgb(hue, sat, lit) {
  hue = hue % 360;
  sat = clamp(sat, 0, 1);
  lit = clamp(lit, 0, 1);

  let chroma = (1.0 - Math.abs(2.0 * lit - 1)) * sat * 255.0;
  let x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  let min = lit * 255 - chroma / 2;
  chroma += min;
  x += min;

  if (hue <= 60) {
    return [chroma, x, min];
  } else if (hue <= 120) {
    return [x, chroma, min];
  } else if (hue <= 180) {
    return [min, chroma, x];
  } else if (hue <= 240) {
    return [min, x, chroma];
  } else if (hue <= 300) {
    return [x, min, chroma];
  } else {
    return [chroma, min, x];
  }
}

const rgb2hex = (rgb, compress = false) => {
  const integer =
    ((Math.round(rgb[0]) & 0xff) << 16) +
    ((Math.round(rgb[1]) & 0xff) << 8) +
    (Math.round(rgb[2]) & 0xff);

  const string = integer.toString(16).toUpperCase();
  if (compress) {
    // reduce color accuracy crudely
    return string
      .padStart(6, "0")
      .split("")
      .filter((_, i) => i % 2)
      .join("");
  } else {
    return string.padStart(6, "0");
  }
};

export function colorize(text, { hue = 0, scale = 1, compress = false } = {}) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!char.trim()) {
      out += char;
      continue;
    }
    out += `[#${rgb2hex(
      hsl2rgb((i + hue) * 40 * scale, 1, 0.7),
      compress
    )}]${char}`;
  }
  return out;
}

export function colorizeHTML(
  text,
  { hue = 0, scale = 1, compress = false } = {}
) {
  let out = [];
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    let span = document.createElement("span");
    span.innerText = char;
    span.style.color = `#${rgb2hex(
      hsl2rgb((i + hue) * 40 * scale, 1, 0.7),
      compress
    )}`;
    out.push(span);
  }
  return out;
}

customElements.define(
  "rainbow-text",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["hue", "scale"];
    }

    constructor() {
      super();
      this.render();
    }

    render() {
      let text = this.innerText;
      this.innerText = "";
      this.append(
        ...colorizeHTML(text, {
          hue: parseInt(this.getAttribute("hue")) || undefined,
          scale: parseFloat(this.getAttribute("scale")) || undefined
        })
      );
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  }
);
