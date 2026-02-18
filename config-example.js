//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  //Settings that can be specified by the authors
  skin: "STANDARD", //can be STANDARD, RETRO or FUTURISTIC
  //Settings that will be automatically specified by the Escapp server
  // locale: "es", //if locale is undefined, you can set locale in app

  escappClientSettings: {
    endpoint: "https://escapp.es/api/escapeRooms/id",
    linkedPuzzleIds: [1],
    rtc: false,
  },
};
