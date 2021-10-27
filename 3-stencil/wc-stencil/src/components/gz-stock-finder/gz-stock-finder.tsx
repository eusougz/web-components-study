import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { AV_API_KEY } from '../../global/constants';

@Component({
  tag: 'gz-stock-finder',
  styleUrl: './gz-stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() symbolsSearchResult: { name: string; symbol: string }[];
  @State() loading = false;

  @Event({ bubbles: true, composed: true }) gzSymbolSelected: EventEmitter<string>;

  onSearchStockSymbol(event: Event) {
    this.loading = true;
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(({ bestMatches }) => {
        this.symbolsSearchResult = bestMatches.map((m: { [x: string]: string }) => ({ symbol: m['1. symbol'], name: m['2. name'] }));
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        console.log(err);
      });
  }

  onSelectSymbol(symbol: string) {
    this.gzSymbolSelected.emit(symbol);
  }

  render() {
    let searchContent = <p>Type stock symbol to search</p>;
    if (this.loading) {
      searchContent = <gz-spinner />
    } else if (this.symbolsSearchResult) {
      if (this.symbolsSearchResult.length) {
        searchContent = (
          <div>
            <p><strong>Best matches</strong></p>
            <ul>
              {this.symbolsSearchResult.map(({ symbol, name }) => (
                <li onClick={() => this.onSelectSymbol(symbol)}>
                  {symbol}
                  <span class="stock-name">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        searchContent = (
          <p>
            No results find to <i>{this.stockNameInput.value}</i> stock symbol
          </p>
        );
      }
    };

    return [
      <form onSubmit={e => this.onSearchStockSymbol(e)}>
        <input id="stock-symbol" type="text" ref={el => (this.stockNameInput = el as HTMLInputElement)} />
        <button type="submit">Search stock symbol</button>
      </form>,
      <div>{searchContent}</div>,
    ];
  }
}
