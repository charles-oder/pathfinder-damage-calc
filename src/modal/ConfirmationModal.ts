import ModalStyles from "@/modal/ModalStyles";

export default class ConfirmationModal {
  private static callback: (confirm: boolean) => void = () => {
    // default
  };

  public static show(title: string, callback: (confirm: boolean) => void) {
    this.callback = callback;
    const background = ModalStyles.createBackground();
    const panel = ModalStyles.createMainPanel();
    const titleContainer = this.createTitlePanel();
    const titleElement = this.createTitleElement(title);
    const buttonContainer = ModalStyles.createButtonPanel();
    const yesButton = ModalStyles.createButton("Yes", "green", this.confirm);
    const noButton = ModalStyles.createButton("No", "red", this.cancel);

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

    const hiddenInput = this.createHiddenKeyboardListener();
    background.appendChild(hiddenInput);
    hiddenInput.focus();
  }

  private static createTitlePanel(): HTMLElement {
    const div = document.createElement("div");
    div.style.padding = "20px 0 0 0";
    return div;
  }

  private static createHiddenKeyboardListener() {
    const hiddenInput = document.createElement("input");
    hiddenInput.style.opacity = "0";
    hiddenInput.onkeydown = key => {
      console.log(key);
      if (key.code === "Enter") {
        this.confirm();
      } else if (key.code === "Escape") {
        this.cancel();
      }
    };
    return hiddenInput;
  }

  private static createTitleElement(title: string): HTMLElement {
    const titleView = document.createElement("div") as HTMLInputElement;
    titleView.innerText = title;
    titleView.style.fontSize = "1.5em";
    titleView.style.textAlign = "center";
    return titleView;
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
