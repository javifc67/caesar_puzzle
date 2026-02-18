export const DEFAULT_APP_SETTINGS = {
  skin: "STANDARD", //skin can be STANDARD
  backgroundImg: "NONE", //background can be "NONE" or a URL.
};

export const ESCAPP_CLIENT_SETTINGS = {
  imagesPath: "./images/",
};
export const MAIN_SCREEN = "MAIN_SCREEN";

export const THEMES = {
  STANDARD: "STANDARD",
  RETRO: "RETRO",
  FUTURISTIC: "FUTURISTIC",
};

export const THEME_ASSETS = {
  [THEMES.STANDARD]: {
    // backgroundImg: "/images/bg_standard.png",
  },
  [THEMES.RETRO]: {
    backgroundImg: "NONE",
    screenImage: "/images/retro/screen_frame.png",
  },
  [THEMES.FUTURISTIC]: {
    backgroundImg: "NONE",
    screenImage: "/images/futuristic/screen_frame.png",
  }
};

