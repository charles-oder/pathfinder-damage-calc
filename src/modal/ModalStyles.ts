export default class ModalStyles {
  public static createBackground(): HTMLElement {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.height = "100vh";
    div.style.width = "100vw";
    div.style.background = "#0009";
    return div;
  }

  public static createMainPanel(): HTMLElement {
    const div = document.createElement("div");
    div.style.padding = "20px";
    div.style.background = "white";
    div.style.position = "absolute";
    div.style.top = "25%";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.borderRadius = "5px";
    return div;
  }

  public static createButtonPanel(): HTMLElement {
    const buttonContainer = document.createElement("div") as HTMLDivElement;
    return buttonContainer;
  }

  public static createButton(
    name: string,
    color: string,
    onCLick: () => void
  ): HTMLElement {
    const button = document.createElement("button") as HTMLButtonElement;
    button.style.border = "none";
    button.style.fontSize = "1.5em";
    button.style.fontWeight = "bold";
    button.style.color = "white";
    button.style.padding = "5px 10px";
    button.style.margin = "5px 20px";
    button.onclick = onCLick;
    button.innerText = name;
    button.style.background = color;
    button.addEventListener("focus", function() {
      this.style.outline = "0";
    });
    return button;
  }
}
