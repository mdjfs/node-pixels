
# Pixels Library

[![npm version](https://badge.fury.io/js/node-pixels.svg)](https://badge.fury.io/js/node-pixels)

Library for image web manipulation. Using the Pixels.js library (https://silvia-odwyer.github.io/pixels.js/)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

You can install the Pixels Image React Component using npm:

```bash
npm install node-pixels
```

or yarn:

```bash
yarn add node-pixels
```

## Usage


### Basic Use

```javascript
import Pixels from 'node-pixels';

async function loadFilter(element) {
  const canvas = document.createElement("canvas"); // create canvas
  const source = await Pixels.getImageSource(element); // get source of <img> element
  let { context, data } = await Pixels.drawImageSource(canvas, source); // draw image into canvas
  await Pixels.adjustColors(data, {
    brightness: 0.5,
    saturation: 0.2,
    contrast: -0.3
  }); // adjust colors (example values)
  await Pixels.loadFilter(data, "coral"); // or ["coral", ...] to apply more than one filter
  await Pixels.applyChanges(data, context); // apply changes into context
  await Pixels.setVerticalFlip(canvas, context); // apply vertical flip
  await Pixels.setHorizontalFlip(canvas, context); // apply horizontal flip
  element.src = canvas.toDataURL("image/png"); // draw image into element (change mimetype if is needed) 

  // reset changes:
  Pixels.reset(source, context);
  element.src = canvas.toDataURL("image/png"); // draw image into element (change mimetype if is needed)
}

loadFilter(document.getElementById("my-image"));

```