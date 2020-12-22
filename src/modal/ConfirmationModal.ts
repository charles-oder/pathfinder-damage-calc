export default class ConfirmationModal {
  private static callback: (confirm: boolean) => void = () => {
    // default
  };

  public static show(title: string, callback: (confirm: boolean) => void) {
    this.callback = callback;
    const background = this.createBackground();
    const panel = this.createMainPanel();
    const titleContainer = this.createTitlePanel();
    const titleElement = this.createTitleElement(title);
    const buttonContainer = this.createButtonPanel();
    const yesButton = this.createButton("Yes", "green", this.confirm);
    const noButton = this.createButton("No", "red", this.hide);

    background.appendChild(panel);
    panel.appendChild(titleContainer);
    titleContainer.appendChild(titleElement);
    panel.appendChild(buttonContainer);
    buttonContainer.appendChild(noButton);
    buttonContainer.appendChild(yesButton);

    const anchor = document.getElementById("test-modal") as HTMLDivElement;
    if (anchor) {
      anchor.innerHTML = "";
      anchor.appendChild(background);
    }
  }

  private static createBackground(): HTMLElement {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.height = "100vh";
    div.style.width = "100vw";
    div.style.background = "#0009";
    return div;
  }

  private static createMainPanel(): HTMLElement {
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

  private static createTitlePanel(): HTMLElement {
    const div = document.createElement("div");
    div.style.padding = "20px 0 0 0";
    return div;
  }

  private static createTitleElement(title: string): HTMLElement {
    const titleView = document.createElement("div") as HTMLInputElement;
    titleView.innerText = title;
    titleView.style.fontSize = "1.5em";
    titleView.style.textAlign = "center";
    return titleView;
  }

  private static createButtonPanel(): HTMLElement {
    const buttonContainer = document.createElement("div") as HTMLDivElement;
    return buttonContainer;
  }

  private static createButton(
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
    return button;
  }

  private static confirm() {
    ConfirmationModal.callback(true);
    ConfirmationModal.hide();
  }

  private static cancel() {
    ConfirmationModal.callback(false);
    ConfirmationModal.hide();
  }

  public static hide() {
    const anchor = document.getElementById("test-modal") as HTMLDivElement;
    if (anchor) {
      anchor.innerHTML = "";
    }
  }
}
