export const checkInstall = () => {
  console.log("checkInstall")
  let installPrompt = null;
  const installButton = document.querySelector("button.install");;
  window.addEventListener("beforeinstallprompt", (event) => {
    console.log("beforeinstallprompt");
    event.preventDefault();
    installPrompt = event;
    installButton.removeAttribute("hidden");
  });
  installButton.addEventListener("click", async () => {
    console.log("Install button click");
    if (!installPrompt) {
      return;
    }
    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    disableInAppInstallPrompt();
  });

  function disableInAppInstallPrompt() {
    console.log("disableInAppInstallPrompt");
    installPrompt = null;
    installButton.setAttribute("hidden", "");
  }

  window.addEventListener("appinstalled", () => {
    console.log("APP INSTALLED");
    disableInAppInstallPrompt();
  });
}
