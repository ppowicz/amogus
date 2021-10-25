import axios from "axios";

// TODO transfer all api functionalities here

const apiPaths = {
  logout: "http://localhost:8080/auth/logout",
  me: "http://localhost:8080/auth/me"
}

const logout = () => {
  axios.get(apiPaths.logout).then(() => {
    window.location.reload();
  }).catch(error => console.warn(error)); // TODO: Change localhost to api url
}

const getCurrentUser = async () => {
  await axios.get(apiPaths.me).then(response => { // TODO: Change localhost to api url
    return response.data;
  }).catch(error => console.warn(error));
}

export { apiPaths, logout, getCurrentUser }