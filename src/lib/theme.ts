const LOCAL_THEME_KEY = "ctgs.ga_theme";

export type Theme = "dark" | "light";

/**
 * get the saved theme from localStorage
 */
export function getThemeFromLocal(): Theme {
  const local = window.localStorage.getItem(LOCAL_THEME_KEY);
  return (local as Theme) ?? "dark";
}

/**
 * save the new theme to localStorage
 * @param newTheme The new selected theme
 */
export function updateLocalTheme(newTheme: Theme) {
  window.localStorage.setItem(LOCAL_THEME_KEY, newTheme);

  updateBodyClass(newTheme);
}

/**
 * update the body classList with the theme
 */
export function updateBodyClass(theme: Theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}
