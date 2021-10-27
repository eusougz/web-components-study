import { Component, h, Listen, Prop, State, Watch, Host } from '@stencil/core';
import { AV_API_KEY } from '../../global/constants';

@Component({
  tag: 'gz-stock-price',
  styleUrl: './gz-stock-price.css',
  shadow: true,
})
export class StockPrice {
  // @Element()
  // el: HTMLElement;

  stockPriceInputEl: HTMLInputElement;
  // initialStockSymbol: string;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockPriceValid = false;
  @State() errMessage: string;
  @State() loading = false;

  @Prop({ reflect: true, mutable: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }

  @Listen('gzSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent) {
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail;
    }
  }

  onFetchStockPrice(e: Event) {
    e.preventDefault();

    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value
    this.stockSymbol = this.stockPriceInputEl.value;

    // this.fetchStockPrice(stockSymbol);
  }

  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.validateUserInput();
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Invalid');
        }
        return res.json();
      })
      .then(parsedRes => {
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid symbol');
        }
        this.errMessage = null;
        this.loading = false;
        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
      })
      .catch(err => {
        this.errMessage = err.message;
        this.loading = false;
      });
  }

  validateUserInput() {
    if (this.stockUserInput.trim()) {
      this.stockPriceValid = true;
    } else {
      this.stockPriceValid = false;
    }
  }

  componentWillLoad() {
    if (this.stockSymbol) {
      this.stockUserInput = this.stockSymbol;
      this.validateUserInput();
      this.fetchStockPrice(this.stockUserInput);
    }
  }

  render() {
    let dataContent = <p>Please enter the symbol</p>;
    if (this.loading) {
      dataContent = <gz-spinner />
    } else if (this.errMessage) {
      dataContent = <p class="err-message">{this.errMessage}</p>;
    } else if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

    return (
      <Host
        class={this.errMessage && 'error'}
      >
        <form onSubmit={e => this.onFetchStockPrice(e)}>
          <input id="stock-symbol" type="text" ref={el => (this.stockPriceInputEl = el as HTMLInputElement)} value={this.stockUserInput} onInput={e => this.onUserInput(e)} />
          <button type="submit" disabled={!this.stockPriceValid || this.loading}>
            Fetch
          </button>
        </form>
        <div>{dataContent}</div>
      </Host>
    );
  }
}
