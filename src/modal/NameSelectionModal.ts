import ModalStyles from "@/modal/ModalStyles";

export default class NameSelectionModal {
  private static callback: (name: string | null) => void = () => {
    // default
  };

  public static show(name: string, callback: (name: string | null) => void) {
    NameSelectionModal.callback = callback;
    const background = ModalStyles.createBackground();
    const panel = ModalStyles.createMainPanel();
    const inputContainer = NameSelectionModal.createInputPanel();
    const input = NameSelectionModal.createInput(name);
    const buttonContainer = ModalStyles.createButtonPanel();
    const yesBtn = ModalStyles.createButton("Confirm", "green", this.confirm);
    const noBtn = ModalStyles.createButton("Cancel", "red", this.cancel);

    background.appendChild(panel);
    panel.appendChild(inputContainer);
    inputContainer.appendChild(input);
    panel.appendChild(buttonContainer);
    buttonContainer.appendChild(noBtn);
    buttonContainer.appendChild(yesBtn);

    const anchor = document.getElementById("test-modal") as HTMLDivElement;
    if (anchor) {
      anchor.innerHTML = "";
      anchor.appendChild(background);
      input.focus();
    }
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
