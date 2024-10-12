import { main } from "../main.js";

const elementCode = ".mermaid";

const saveOriginalData = function () {
  return new Promise((resolve, reject) => {
    try {
      var els = document.querySelectorAll(elementCode),
        count = els.length;
      els.forEach((element) => {
        element.setAttribute("data-original-code", element.innerHTML);
        count--;
        if (count == 0) {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const resetProcessed = function () {
  return new Promise((resolve, reject) => {
    try {
      var els = document.querySelectorAll(elementCode),
        count = els.length;
      els.forEach((element) => {
        if (element.getAttribute("data-original-code") != null) {
          element.removeAttribute("data-processed");
          element.innerHTML = element.getAttribute("data-original-code");
        }
        count--;
        if (count == 0) {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const ModeToggle = {
  modeToggleButton_dom: null,
  iconDom: null,
  mermaidLightTheme: null,
  mermaidDarkTheme: null,

  async mermaidInit(theme) {
    if (window.mermaid) {
      await resetProcessed();
      mermaid.initialize({ theme });
      mermaid.init({ theme }, document.querySelectorAll(elementCode));
    }
  },

  enableLightMode() {
    document.body.classList.remove("dark-mode");
    document.documentElement.classList.remove("dark");
    document.body.classList.add("light-mode");
    document.documentElement.classList.add("light");
    this.iconDom.className = "fa-regular fa-moon";
    main.styleStatus.isDark = false;
    main.setStyleStatus();
    this.mermaidInit(this.mermaidLightTheme);
    this.setGiscusTheme();
  },

  enableDarkMode() {
    document.body.classList.remove("light-mode");
    document.documentElement.classList.remove("light");
    document.body.classList.add("dark-mode");
    document.documentElement.classList.add("dark");
    this.iconDom.className = "fa-regular fa-brightness";
    main.styleStatus.isDark = true;
    main.setStyleStatus();
    this.mermaidInit(this.mermaidDarkTheme);
    this.setGiscusTheme();
  },

  async setGiscusTheme(theme) {
    if (document.querySelector("#giscus-container")) {
      let giscusFrame = document.querySelector("iframe.giscus-frame");
      while (!giscusFrame) {
        await new Promise((r) => setTimeout(r, 1000));
        giscusFrame = document.querySelector("iframe.giscus-frame");
      }
      while (giscusFrame.classList.contains("giscus-frame--loading"))
        await new Promise((r) => setTimeout(r, 1000));
      theme ??= main.styleStatus.isDark ? "dark" : "light";
      giscusFrame.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: theme,
            },
          },
        },
        "https://giscus.app",
      );
    }
  },

  isDarkPrefersColorScheme() {
    return (
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
    );
  },

  initModeStatus() {
    // �Ƴ�ԭ���жϣ�ǿ������Ϊ��ɫģʽ
    this.enableDarkMode();
  },

  initModeToggleButton() {
    this.modeToggleButton_dom.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      isDark ? this.enableLightMode() : this.enableDarkMode();
    });
  },

  initModeAutoTrigger() {
    // �Ƴ��Զ��л����ܣ�ǿ��ʹ����ɫģʽ
    // const isDarkMode = this.isDarkPrefersColorScheme();
    // isDarkMode.addEventListener("change", (e) => {
    //   e.matches ? this.enableDarkMode() : this.enableLightMode();
    // });
  },

  async init() {
    this.modeToggleButton_dom = document.querySelector(
      ".tool-dark-light-toggle",
    );
    this.iconDom = document.querySelector(".tool-dark-light-toggle i");
    this.mermaidLightTheme =
      typeof theme.mermaid !== "undefined" &&
      typeof theme.mermaid.style !== "undefined" &&
      typeof theme.mermaid.style.light !== "undefined"
        ? theme.mermaid.style.light
        : "default";
    this.mermaidDarkTheme =
      typeof theme.mermaid !== "undefined" &&
      typeof theme.mermaid.style !== "undefined" &&
      typeof theme.mermaid.style.dark !== "undefined"
        ? theme.mermaid.style.dark
        : "dark";
    this.initModeStatus();  // ǿ�Ƶ�����ɫģʽ
    this.initModeToggleButton();
    // �Ƴ��Զ�����ԭ�е��ã�ǿ����������
    await saveOriginalData().catch(console.error);
  },
};

// Exported function
export default function initModeToggle() {
  ModeToggle.init();
}
