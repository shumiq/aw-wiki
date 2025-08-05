import { createEffect, createSignal, Match, Switch } from "solid-js";
import { getCookie, setCookie } from "~/utils/cookie";

type GoogleTranslateWindowObject = {
  translate: {
    TranslateElement: (
      options: { [key: string]: string | number },
      elementId: string,
    ) => void;
  };
};

const [language, setLanguage] = createSignal("en");
const [ready, setReady] = createSignal(false);

export function TranslationProvider() {
  createEffect(() => {
    const initGoogleTranslate = () => {
      if (ready()) return;
      if ("google" in window) {
        const google = window.google as GoogleTranslateWindowObject;
        if (google.translate.TranslateElement) {
          google.translate.TranslateElement(
            {
              pageLanguage: "ru",
              includedLanguages: "en,th",
              layout: 0,
            },
            "google_translate_element",
          );
        }
      }
      setTimeout(() => {
        const dropdown = document.querySelector(
          ".goog-te-combo",
        ) as HTMLSelectElement;
        if (dropdown) {
          setReady(true);
          const lang = getCookie("lang") ?? "en";
          setLanguage(lang);
          setTimeout(() => {
            dropdown.value = lang;
            dropdown.dispatchEvent(new Event("change"));
          }, 500);
        } else initGoogleTranslate();
      }, 50);
    };
    if (!ready()) initGoogleTranslate();
  });
  createEffect(() => {
    if (!ready()) return;
    const dropdown = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement;
    if (!dropdown) return;
    dropdown.value = language();
    dropdown.dispatchEvent(new Event("change"));
  });
  return <div id="google_translate_element" class="hidden"></div>;
}

export function TranslationSwitchButton() {
  return (
    <Switch fallback={<span class="loading loading-spinner loading-xs"></span>}>
      <Match when={ready() && language() === "en"}>
        <button
          class="btn btn-primary btn-sm btn-square"
          onclick={() => {
            setLanguage("th");
            setCookie("lang", "th");
          }}
        >
          EN
        </button>
      </Match>
      <Match when={ready() && language() === "th"}>
        <button
          class="btn btn-primary btn-sm btn-square"
          onclick={() => {
            setLanguage("en");
            setCookie("lang", "en");
          }}
        >
          TH
        </button>
      </Match>
    </Switch>
  );
}
