export default class NameSelectionModal {
  private static callback: (name: string | null) => void = () => {
    // default
  };

  public static show(name: string, callback: (name: string | null) => void) {
    NameSelectionModal.callback = callback;
    const background = NameSelectionModal.createBackground();
    const panel = NameSelectionModal.createMainPanel();
    const inputContainer = NameSelectionModal.createInputPanel();
    const input = NameSelectionModal.createInput(name);
    const buttonContainer = NameSelectionModal.createButtonPanel();
    const confirmButton = NameSelectionModal.createButton(
      "Confirm",
      "green",
      this.confirm
    );
    const cancelButton = NameSelectionModal.createButton(
      "Cancel",
      "red",
      this.hide
    );

    background.appendChild(panel);
    panel.appendChild(inputContainer);
    inputContainer.appendChild(input);
    panel.appendChild(buttonContainer);
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);

    const anchor = document.getElementById("test-modal") as HTMLDivElement;
    if (anchor) {
      anchor.innerHTML = "";
      anchor.appendChild(background);
      input.focus();
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

  private static createInputPanel(): HTMLElement {
    const div = document.createElement("div");
    div.style.padding = "20px 0 0 0";
    return div;
  }

  private static createInput(name: string): HTMLElement {
    const input = document.createElement("input") as HTMLInputElement;
    input.id = "nameInput";
    input.value = name;
    input.style.fontSize = "1.5em";
    input.style.textAlign = "center";
    input.onfocus = () => {
      input.select();
    };
    return input;
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
    const nameElement = document.getElementById(
      "nameInput"
    ) as HTMLInputElement;
    NameSelectionModal.callback(nameElement.value);
    NameSelectionModal.hide();
  }

  private static cancel() {
    NameSelectionModal.callback(null);
    NameSelectionModal.hide();
  }

  public static hide() {
    const anchor = document.getElementById("test-modal") as HTMLDivElement;
    if (anchor) {
      anchor.innerHTML = "";
    }
  }
}
