const { LitElement, html, css } = require('lit')
const { commonCss, displayScreen } = require('./components/common')
const { parseChatFormat } = require('./components/parseChat')

class LoadingScreen extends LitElement {
  static get styles () {
    return css`
      ${commonCss}
      .title {
        top: 30px;
      }

      #cancel-btn {
        position: absolute;
        top: calc(20% + 50px);
        left: 50%;
        transform: translate(-50%);
      }
    `
  }

  static get properties () {
    return {
      status: { type: String },
      loadingText: { type: String },
      hasError: { type: Number }
    }
  }

  constructor () {
    super()
    this.hasError = false
    this.status = 'Waiting for JS load'
  }

  firstUpdated () {
    this.statusRunner()
  }

  async statusRunner () {
    const array = ['.', '..', '...', '']
    const timer = ms => new Promise((resolve) => setTimeout(resolve, ms))

    const load = async () => {
      for (let i = 0; true; i = ((i + 1) % array.length)) {
        this.loadingText = this.status + array[i]
        await timer(500)
      }
    }

    load()
  }

  render () {
    return html`
      <div class="dirt-bg"></div>

      <p class="title">${this.hasError ? this.status : this.loadingText}</p>
	  
	  <div class="button-wrapper">
		<pmui-button id="cancel-btn" pmui-width="200px" pmui-label="Cancel" @pmui-click=${() => displayScreen(this, document.getElementById('title-screen'))}></pmui-button>
	  </div>
    `
  }
}

window.customElements.define('pmui-loadingscreen', LoadingScreen)
