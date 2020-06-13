const storageKey = 'loggedUser';
const saveUser = (user) => sessionStorage.setItem(storageKey, JSON.stringify(user));

const loadUser = () => JSON.parse(sessionStorage.getItem(storageKey));

const logoutUser = () => sessionStorage.removeItem(storageKey);

export default {
  saveUser,
  loadUser,
  logoutUser,
};
