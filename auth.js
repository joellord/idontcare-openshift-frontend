const ACCESS_TOKEN = "access_token";

let auth = {};

let keycloak;
let isKeycloakInitialized = false;

auth.login = () => {
  if (!USE_KEYCLOAK) {
    return auth.loginTraditional();
  } else {
    return auth.loginKeycloak();
  }
};

auth.logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  if (USE_KEYCLOAK && isKeycloakInitialized) keycloak.logout();
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

auth.keycloakInit = () => {
  keycloak = Keycloak({
    "realm": "idontcare",
    "clientId": "idontcare",
    "auth-server-url": "http://keycloak-idontcare.apps.us-east-2.online-starter.openshift.com/auth",
    "ssl-required": "external",
    "resource": "idontcare",
    "public-client": true
  });
  keycloak.init({ flow: "implicit"}).success(() => {
    isKeycloakInitialized = true;
    console.log("Initialized");
  }).error(err => {
    console.log("Not Initialized", err);
  });
}

auth.loginKeycloak = () => {
  if (isKeycloakInitialized) keycloak.login();
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