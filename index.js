let API_URL = "http://localhost:8888";
let HTTP_CAT_URL = "http://http.cat";
let AUTH_URL = "http://localhost:8080";
let USE_KEYCLOAK = false;

fetch("/config").then(resp => resp.json()).then(config => {
  console.log("Got config");
  if (config.API_URL) API_URL = config.API_URL;
  if (config.HTTP_CAT_URL) HTTP_CAT_URL = config.HTTP_CAT_URL;
  if (config.AUTH_URL) AUTH_URL = config.AUTH_URL;
  if (config.USE_KEYCLOAK) USE_KEYCLOAK = config.USE_KEYCLOAK;
});

//Reset token
localStorage.removeItem("access_token");

const headlineBtn = document.querySelector("#headline");
const secretBtn = document.querySelector("#secret");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");

headlineBtn.addEventListener("click", () => {
  fetcher(API_URL + "/headline");
});

secretBtn.addEventListener("click", (event) => {
  fetcher(API_URL + "/protected/headline");
});

logoutBtn.addEventListener("click", (event) => {
  auth.logout();
  UIUpdate.loggedOut();
});

loginBtn.addEventListener("click", (event) => {
  auth.login().then(() => UIUpdate.loggedIn());
});

//Set the initial cat (in case we're offline)
UIUpdate.updateCat(200);