const appVariables = {
    CHAT_URL: "",
    MULTI_LANGUAGES: ["EN","TH","VN"],
    BASE_CSS: "./css/theme_green_sea.css",
};
function getAppConfigs() {
    return appVariables;
}
function getAppConfig(key) {
    return appVariables[key];
}
console.log("appVariables",appVariables);
