export default class NameSelectionModal {
  private static callback: (name: string | null) => void = () => {
    // default
  };

  public static show(name: string, callback: (name: string | null) => void) {
    NameSelectionModal.callback = callback;
    const background = document.createElement("div");
    this.styleBackground(background);

    const panel = document.createElement("div");
    this.stylePanel(panel);

    const inputContainer = document.createElement("div") as HTMLDivElement;
    inputContainer.style.padding = "20px 0 0 0";

    const input = document.createElement("input") as HTMLInputElement;
    input.id = "nameInput";
    input.value = name;
    input.style.fontSize = "1.5em";
    input.style.textAlign = "center";
    input.onfocus = () => {
      input.select();
    };

    const buttonContainer = document.createElement("div") as HTMLDivElement;

    const confirmButton = document.createElement("button") as HTMLButtonElement;
    this.styleButton(confirmButton);
    confirmButton.onclick = this.confirm;
    confirmButton.innerText = "Confirm";
    confirmButton.style.background = "green";

    const cancelButton = document.createElement("button") as HTMLButtonElement;
    this.styleButton(cancelButton);
    cancelButton.onclick = this.hide;
    cancelButton.innerText = "Cancel";
    cancelButton.style.background = "red";

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

  private static styleBackground(div: HTMLDivElement) {
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.height = "100vh";
    div.style.width = "100vw";
    div.style.background = "#0009";
  }

  private static stylePanel(div: HTMLDivElement) {
    div.style.padding = "20px";
    div.style.background = "white";
    div.style.position = "absolute";
    div.style.top = "25%";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.borderRadius = "5px";
  }

  private static styleButton(button: HTMLButtonElement) {
    button.style.border = "none";
    button.style.fontSize = "1.5em";
    button.style.fontWeight = "bold";
    button.style.color = "white";
    button.style.padding = "5px 10px";
    button.style.margin = "5px 20px";
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
