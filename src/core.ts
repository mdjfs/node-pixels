import { EXPORT_OBJECT, FILTERS, EDIT_COLORS, VALID_MIMETYPE, PixelsImageSource, PixelsImageData } from "./types"
import Pixels from "./pixels-lib"
import { getInferedType } from "./utils";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const getSaturationVars = (percentage: number) => {
  const factor = percentage + 1;
  const perc = percentage * -1;
  const luminanceR = 0.3086;
  const luminanceG = 0.6094;
  const luminanceB = 0.0820;
  return {
    az: perc*luminanceR + factor,
    bz: perc*luminanceG,
    cz: perc*luminanceB,
    dz: perc*luminanceR,
    ez: perc*luminanceG + factor,
    fz: perc*luminanceB,
    gz: perc*luminanceR,
    hz: perc*luminanceG,
    iz: perc*luminanceB + factor
  }
}


export const adjustColors = (imgData: ImageData, colors: EDIT_COLORS) => {
  return new Promise((r) => {
    let factor: number;
    let saturationVars;
    if(colors.saturation) saturationVars = getSaturationVars(colors.saturation)
    const length = imgData.data.length;
    for(let i = 0; i < length; i+= 4) {
      if(colors.brightness) {
        factor = colors.brightness + 1;
        imgData.data[i] *= factor;
        imgData.data[i + 1] *= factor;
        imgData.data[i + 2] *= factor;
      }
      if(colors.contrast) {
        factor = colors.contrast + 1;
        imgData.data[i] = clamp(factor * (imgData.data[i] - 128) + 128, 0, 255);
        imgData.data[i + 1] = clamp(factor * (imgData.data[i + 1] - 128) + 128, 0, 255);
        imgData.data[i + 2] = clamp(factor * (imgData.data[i + 2] - 128) + 128, 0, 255);
      }
      if(colors.saturation && saturationVars) {
        var red = imgData.data[i];
        var green = imgData.data[i + 1];
        var blue = imgData.data[i + 2];
        imgData.data[i] = (saturationVars.az*red + saturationVars.bz*green + saturationVars.cz*blue);
        imgData.data[i + 1] = (saturationVars.dz*red + saturationVars.ez*green + saturationVars.fz*blue);
        imgData.data[i + 2] = (saturationVars.gz*red + saturationVars.hz*green + saturationVars.iz*blue);
      }
    }
    r(null)
  })
}

export const setVerticalFlip = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempContext = tempCanvas.getContext("2d");
  tempContext?.scale(1, -1);
  tempContext?.drawImage(canvas, 0, -canvas.height);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(tempCanvas, 0, 0);
}

export const setHorizontalFlip = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempContext = tempCanvas.getContext("2d");
  tempContext?.scale(-1, 1);
  tempContext?.drawImage(canvas, -canvas.width, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(tempCanvas, 0, 0);
}

export const loadFilter = (imgData: ImageData, filter: FILTERS[] | FILTERS) => {
  return new Promise((r) => {
    for(const flt of Array.isArray(filter) ? filter : [filter]) {
      if(Pixels.filter_dict[flt as FILTERS]){
        imgData = Pixels.filter_dict[flt as FILTERS](imgData)
      } else throw new Error(`${flt} is not a valid filter!`)
    }
    r(null)
  })
}

export const applyChanges = (imageData: ImageData, context: CanvasRenderingContext2D) => {
 context.putImageData(imageData, 0, 0);
}

export const reset = (source: PixelsImageSource, context: CanvasRenderingContext2D) => {
  applyChanges(source.data, context);
}

export const getExportObject: (c: HTMLCanvasElement, type: string) => EXPORT_OBJECT = (c: HTMLCanvasElement, type: string) => {
  const canvas = c;
  const inferedMimetype = type;
  const toBlob = () => new Promise((r) => {
    if(canvas) {
      canvas.toBlob(b => r(b as Blob), inferedMimetype)
    } else r(null)
  }) as Promise<Blob|null>
  return {
      /**
     * Gets a Blob of the canvas content.
     * Ideal method for large images, optimizes the image size
     * It's advisable to handle dataURLs for small images, as converting to blobs, even for small images, might introduce unnecessary delays
     * @returns {Promise<Blob|null>} Promise that resolves with the Blob or null if the canvas is not available.
     */
    getBlob: async (): Promise<Blob | null> => await toBlob(),
    /**
     * Gets a data URL of the canvas content.
     * Faster method for <1MB images (3-35ms). Slowly for large images
     * Caution: Avoid using this method for very large images, as they may significantly increase the image size
     * @returns {string|undefined} Data URL or null if the canvas is not available.
     */
    getDataURL: (): string | undefined => {
      if(canvas) return canvas.toDataURL(inferedMimetype)
    },
    /**
     * Gets the canvas itself.
     * Faster method. Takes ~0.01ms to get the canvas element
     * @returns {HTMLCanvasElement|null} Canvas element or null if the canvas is not available.
     */
    getCanvas: (): HTMLCanvasElement | null => canvas,
    /**
     * Gets an Image object from the canvas content using DataURL (small images)
     * @returns {Promise<HTMLImageElement | undefined>} Promise that resolves with the Image object or null if the canvas is not available.
     */
    getImageFromDataURL: async (): Promise<HTMLImageElement | undefined> => {
      if(canvas) {
        const img = new Image();
        img.src = canvas.toDataURL(inferedMimetype);
        return img;
      }
    },
    /**
     * Gets an Image object from the canvas content using Blob (large images)
     * @returns {Promise<HTMLImageElement | undefined>} Promise that resolves with the Image object or null if the canvas is not available.
     */
    getImageFromBlob: async (): Promise<HTMLImageElement | undefined> => {
      if(canvas) {
        const img = new Image();
        const blob = await toBlob();
        if(!blob) return;
        img.src = URL.createObjectURL(blob)
        return img;
      }
    },
    getInferedMimetype: (): string => inferedMimetype,
  }
}

const createImage = async (src: string, crossOrigin?: boolean) => {
  const img = new Image();
  img.src = src;
  if(crossOrigin) img.crossOrigin = "anonymous";
  return new Promise<HTMLImageElement|null>((r) => {
    img.onerror = () => r(null)
    img.onload = () => r(img)
  })
}

const getImageDataFromElement = (element: HTMLImageElement | HTMLCanvasElement) => {
  if(element instanceof HTMLCanvasElement) {
    const context = element.getContext("2d");
    if(!context) throw new Error("PixelsImage: Error obtaining the canvas context");
    return context.getImageData(0, 0, element.width, element.height);
  }
  if(typeof document !== "object") throw new Error ("Pixels Image: Running out of the browser");
  const canvas = document.createElement("canvas");
  canvas.height = element.height;
  canvas.width = element.width;
  const context = canvas.getContext("2d");
  if(!context) throw new Error("PixelsImage: Error obtaining the canvas context");
  const pattern = context.createPattern(element, 'no-repeat') as CanvasPattern;
  context.fillStyle = pattern;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

export const drawImageSource = (canvas: HTMLCanvasElement, source: PixelsImageSource): PixelsImageData => {
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if(!context) throw new Error("PixelsImage: Error obtaining the canvas context")
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.putImageData(source.data, 0, 0);
  const cloned = new ImageData(canvas.width, canvas.height);
  cloned.data.set(source.data.data);
  return { 
    context, 
    imageData: cloned
  }
}

export const getImageSource = async (src: HTMLImageElement | HTMLCanvasElement | string, type?: VALID_MIMETYPE): Promise<PixelsImageSource> => {
  let element: HTMLImageElement | HTMLCanvasElement;
  if(typeof src === "string") {
    const img = await createImage(src, true);
    if(!img && src.startsWith("http")) {
      throw new Error("PixelsImage: There was a CORS error while loading the image. Please consider saving it on your local server or configuring the CORS rules of the remote server.")
    } else if (!img) {
      throw new Error("PixelsImage: Unknown error while loading the image.")
    }
    element = img;
    if(!type) type = getInferedType(src);
  } else {
    element = src;
    if (!type) { 
      if(element instanceof HTMLImageElement) {
        type = getInferedType(element.src);
      } else type = 'image/png'
    }
  }
  return {
    width: element.width,
    height: element.height,
    type,
    data: getImageDataFromElement(element)
  }
}