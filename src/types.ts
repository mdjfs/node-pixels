export type FILTERS = 'horizontal_lines'|'extreme_offset_blue'|'ocean'|
  'extreme_offset_green'|'offset_green'|'extra_offset_blue'|
  'extra_offset_red'|'extra_offset_green'|'extreme_offset_red'|
  'specks_redscale'|'vintage'|'perfume'|
  'serenity'|'eclectic'|'diagonal_lines'|
  'green_specks'|'warmth'|'casino'|
  'green_diagonal_lines'|'offset'|'offset_blue'|
  'neue'|'sunset'|'specks'|
  'wood'|'lix'|'ryo'|
  'bluescale'|'solange'|'evening'|
  'crimson'|'teal_min_noise'|'phase'|
  'dark_purple_min_noise'|'coral'|'darkify'|
  'incbrightness'|'incbrightness2'|'yellow_casino'|
  'invert'|'sat_adj'|'lemon'|
  'pink_min_noise'|'frontward'|'pink_aura'|
  'haze'|'cool_twilight'|'blues'|
  'horizon'|'mellow'|'solange_dark'|
  'solange_grey'|'zapt'|'eon'|
  'aeon'|'matrix'|'cosmic'|
  'min_noise'|'red_min_noise'|'matrix2'|
  'purplescale'|'radio'|'twenties'|'pixel_blue'|'greyscale'|
  'grime'|'redgreyscale'|'retroviolet'|
  'greengreyscale'|'green_med_noise'|'green_min_noise'|
  'blue_min_noise'|'rosetint'|'purple_min_noise'|
  'red_effect'|'gamma'|'teal_gamma'|
  'purple_gamma'|'yellow_gamma'|'bluered_gamma'|
  'green_gamma'|'red_gamma'|'black_specks'|
  'white_specks'|'salt_and_pepper'|'rgbSplit'|
  'threshold'|'threshold75'|'threshold125'|
  'pixelate'|'pixelate16'

export const FILTERS_LIST: FILTERS[] = [
  'horizontal_lines',      'extreme_offset_blue', 'ocean',
  'extreme_offset_green',  'offset_green',        'extra_offset_blue',
  'extra_offset_red',      'extra_offset_green',  'extreme_offset_red',
  'specks_redscale',       'vintage',             'perfume',
  'serenity',              'eclectic',            'diagonal_lines',
  'green_specks',          'warmth',              'casino',
  'green_diagonal_lines',  'offset',              'offset_blue',
  'neue',                  'sunset',              'specks',
  'wood',                  'lix',                 'ryo',
  'bluescale',             'solange',             'evening',
  'crimson',               'teal_min_noise',      'phase',
  'dark_purple_min_noise', 'coral',               'darkify',
  'incbrightness',         'incbrightness2',      'yellow_casino',
  'invert',                'sat_adj',             'lemon',
  'pink_min_noise',        'frontward',           'pink_aura',
  'haze',                  'cool_twilight',       'blues',
  'mellow',              'solange_dark',
  'solange_grey',          'zapt',                'eon',
  'aeon',                  'matrix',              'cosmic',
  'min_noise',             'red_min_noise',       'matrix2',
  'purplescale',           'radio',               'twenties',
  'pixel_blue',          'greyscale',
  'grime',                 'redgreyscale',        'retroviolet',
  'greengreyscale',        'green_med_noise',     'green_min_noise',
  'blue_min_noise',        'rosetint',            'purple_min_noise',
  'red_effect',            'gamma',               'teal_gamma',
  'purple_gamma',          'yellow_gamma',        'bluered_gamma',
  'green_gamma',           'red_gamma',           'black_specks',
  'white_specks',          'salt_and_pepper',     'rgbSplit',
  'threshold',             'threshold75',         'threshold125',
  'pixelate',              'pixelate16'
]

export type VALID_MIMETYPE = 'image/jpeg' | 'image/png';

export type EDIT_COLORS = {
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export type EXPORT_OBJECT = {
  getBlob: () => Promise<Blob | null>;
  getDataURL: () => string | undefined;
  getCanvas: () => HTMLCanvasElement | null;
  getImageFromDataURL: () => Promise<HTMLImageElement | undefined>;
  getImageFromBlob: () => Promise<HTMLImageElement | undefined>;
  getInferedMimetype: () => string;
}

export interface PixelsImageSource {
  type: string;
  data: ImageData;
  width: number;
  height: number;
}

export interface PixelsImageData {
  context: CanvasRenderingContext2D,
  imageData: ImageData
}
