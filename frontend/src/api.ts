import axios from "axios";
import IUser from "./interfaces/IUser";

const apiPaths = {
  menu: "http://localhost:8080/menu",

  login: "http://localhost:8080/auth/login",
  register: "http://localhost:8080/auth/register",
  logout: "http://localhost:8080/auth/logout",
  me: "http://localhost:8080/auth/me",
  providers: "https://localhost/auth/providers"
} // TODO: Change localhost to api url

const getMenu = async () => {
  let data;
  await axios.get(apiPaths.menu).then(response => {
    data = response.data;
  }).catch(error => console.warn(error));
  return data;
}

const login = (email: string, password: string) => {
  axios.post(apiPaths.login, {email, password}).then(() => window.location.reload).catch(error => console.warn(error));
}

const register = (email: string, password: string) => {
  axios.post(apiPaths.register, {email, password}).then(() => window.location.reload).catch(error => console.warn(error));
}

const logout = () => {
  axios.get(apiPaths.logout).then(() => window.location.reload).catch(error => console.warn(error));
}

const getCurrentUser = () => {
  return new Promise<IUser>(resolve => {
    axios.get(apiPaths.me).then(response => resolve(response.data)).catch(error => console.warn(error));
  })
}

// const getProviders = () => {
//   return new Promise(resolve => {
//     axios.get(apiPaths.providers).then(response => resolve(response.data)).catch(error => console.warn(error));
//   })
// }

const callProvider = (provider:string) => {
  axios.get(apiPaths.login, {params:{provider}})
}

export { apiPaths, getMenu, login, register, logout, getCurrentUser, callProvider }