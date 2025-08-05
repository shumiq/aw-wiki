import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";

const cookieStore = createStore({} as Record<string, string>);
const [store, setStore] = cookieStore;

createEffect(() => {
  document.cookie.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    setStore(key.trim(), value);
  });
});

export const getCookie = (name: string) => store[name];
export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}`;
  setStore(name, value);
};
