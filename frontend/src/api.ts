import axios from "axios";
import IUser from "./interfaces/IUser";

const apiPaths = {
  menu: "https://pizzeria.cubepotato.eu/menu",
  login: "https://pizzeria.cubepotato.eu/auth/login",
  register: "https://pizzeria.cubepotato.eu/auth/register",
  logout: "https://pizzeria.cubepotato.eu/auth/logout",
  me: "https://pizzeria.cubepotato.eu/auth/me",
  providers: "https://pizzeria.cubepotato.eu/auth/providers",
};

const getMenu = async () => {
  let data;
  await axios
    .get(apiPaths.menu)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => console.warn(error));
  return data;
};

const login = (email: string, password: string) => {
  axios
    .post(apiPaths.login, { email, password })
    .then(() => window.location.reload)
    .catch((error) => console.warn(error));
};

const register = (email: string, password: string) => {
  axios
    .post(apiPaths.register, { email, password })
    .then(() => window.location.reload)
    .catch((error) => console.warn(error));
};

const logout = () => {
  axios
    .get(apiPaths.logout)
    .then(() => window.location.reload)
    .catch((error) => console.warn(error));
};

const getCurrentUser = () => {
  return new Promise<IUser>((resolve) => {
    axios
      .get(apiPaths.me)
      .then((response) => resolve(response.data))
      .catch((error) => console.warn(error));
  });
};

// const getProviders = () => {
//   return new Promise(resolve => {
//     axios.get(apiPaths.providers).then(response => resolve(response.data)).catch(error => console.warn(error));
//   })
// }

const callProvider = (provider: string) => {
  document.location.href = apiPaths.login + "?provider=" + provider;
};

export {
  apiPaths,
  getMenu,
  login,
  register,
  logout,
  getCurrentUser,
  callProvider,
};
