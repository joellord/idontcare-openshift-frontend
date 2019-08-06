const ACCESS_TOKEN = "access_token";

let auth = {};

auth.login = () => {
  if (!USE_KEYCLOAK) {
    return auth.loginTraditional();
  } else {
    return auth.loginKeycloak;
  }
};

auth.logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
};

// loginTradition sends a POST request to the auth server
auth.loginTraditional = () => {
  const loc = window.location;
  let callbackURI = `${loc.protocol}//${loc.hostname}:${loc.port}${loc.pathname}`;
  return window.location.replace(AUTH_URL + "/login?callback=" + encodeURIComponent(callbackURI));
};

// isLoggedIn return true if we have a token in localstorage
auth.isLoggedIn = () => {
  return !!localStorage.getItem(ACCESS_TOKEN);
};

auth.loginKeycloak = () => {
  alert("Not implemented yet");
};

// Parses the hash info on redirect and extracts the
auth.parseHash = () => {
  let hash = window.location.hash.substr(0,1) == "#" ? window.location.hash.substr(1) : window.location.hash;
  let queryParams = {};
  hash.split("&").map(param => {
    param = param.split("=");
    queryParams[param[0]] = param[1];
  });
  if (queryParams.access_token) {
    localStorage.setItem(ACCESS_TOKEN, queryParams.access_token);
    UIUpdate.loggedIn();
    UIUpdate.alertBox("Logged in<br>Access Token: " + queryParams.access_token + "<br>ID Token: " + queryParams.id_token);
  }
  window.location.hash = "";
};

window.addEventListener("DOMContentLoaded", auth.parseHash);