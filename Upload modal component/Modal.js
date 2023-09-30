import data from "./data.js";

export default class Modal extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    this.uploadInprogress = data[0].uploadInprogress;
    this.uploadFinished = data[0].uploadFinished;
    this.uploadError = data[0].uploadError;

    this.progressValue = 65;
    this.status = "finished";

    this.preconnectGstaticfontLink = document.createElement("link");
    this.preconnectGstaticfontLink.rel = "preconnect";
    this.preconnectGstaticfontLink.href = "https://fonts.gstatic.com";

    this.preconnectfontLink = document.createElement("link");
    this.preconnectfontLink.rel = "preconnect";
    this.preconnectfontLink.href = "https://fonts.googleapis.com";

    this.fontLink = document.createElement("link");
    this.fontLink.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap";
    this.fontLink.rel = "stylesheet";

    document.head.appendChild(this.preconnectfontLink);
    document.head.appendChild(this.preconnectGstaticfontLink);
    document.head.appendChild(this.fontLink);
  }

  async connectedCallback() {
    await this.render();
  }

  static get observedAttributes() {
    return ["status"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "status") {
      this.status = newValue;
      this.render();
    }
  }

  async render() {
    const extraSheet = new CSSStyleSheet();
    extraSheet.replaceSync(await this.loadCSS());

    this.shadow.adoptedStyleSheets = [extraSheet];

    this.shadow.innerHTML = "";

    this.shadow.innerHTML = `
      <div class="modal-container">
        <span class="status-icon-container">
          ${this.renderIcon()}
        </span>
        
        <span>
          ${this.headerRender()}
          ${this.bodyRender()}
          <div class=${
            this.status === "progress" ? "modal-footer" : "btn-container"
          }>
            ${this.footerRender()}
          </div>
        </span>
        <button class="close-btn reset-this">X</button>
        </div>
        <p class="link-copied-message hide">Link copied successfully!</p>
    `;

    const copyBtn = this.shadow.querySelector(".copy-to-clipboard");
    const linkCopiedMessageElement = this.shadow.querySelector(
      ".link-copied-message"
    );

    copyBtn.addEventListener("click", (e) => {
      navigator.clipboard.writeText(this.getAttribute("uploadedURLLink"));

      linkCopiedMessageElement.classList.remove("hide");

      setTimeout(() => linkCopiedMessageElement.classList.add("hide"), 3000);
    });

    this.shadow.querySelector(".close-btn").addEventListener("click", () => {
      document.querySelector("modal-component-1").remove();
    });
  }

  headerRender() {
    if (this.status === "progress") {
      return `<h3 class="modal-header">${this.uploadInprogress.header}</h3>`;
    }
    if (this.status === "error") {
      return `<h3 class="modal-header">${this.uploadError.header}</h3>`;
    }
    if (this.status === "finished") {
      return `<h3 class="modal-header">${this.uploadFinished.header}</h3>`;
    }
  }

  async loadCSS() {
    const fetchFile = await fetch("./Modal.css");
    const fileContent = await fetchFile.text();

    return fileContent;
  }
  renderIcon() {
    if (this.status === "progress") {
      return this.uploadInprogress.svgIcon;
    }
    if (this.status === "error") {
      return this.uploadError.svgIcon;
    }
    if (this.status === "finished") {
      return this.uploadFinished.svgIcon;
    }
  }

  bodyRender() {
    if (this.status === "progress") {
      return `<p class="modal-body">${this.uploadInprogress.body}</p>`;
    }
    if (this.status === "error") {
      return `<p class="modal-body">${this.uploadError.body}</p>`;
    }
    if (this.status === "finished") {
      return `<p class="modal-body">${this.uploadFinished.body}</p>`;
    }
  }

  footerRender() {
    if (this.status === "progress") {
      return `<span class="progress-container">
                <progress class="progress-bar" max="100" value="65"></progress>
                <span class="progress-value">${this.progressValue}%</span>
              </span>
              <button class="btn">Cancel</button>`;
    }

    if (this.status === "error") {
      return `<button class="btn">Cancel</button>
               <button class="btn">Retry</button>
              `;
    }

    if (this.status === "finished") {
      return `<button class="btn copy-to-clipboard">Copy Link</button>
               <button class="btn">Done</button>
              `;
    }
  }
}

customElements.define("modal-component-1", Modal);
