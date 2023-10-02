class ConversorMoneda {
    constructor() {
        this.ws = new WebSocket('wss://stream.binance.com:9443/ws/btcbusd@trade');
        this.bitcoinValue = document.querySelector('#bitcoin-value');
        this.colonesValue = document.querySelector('#colones-value');
        this.dollarAmountInput = document.querySelector('#dollar-amount');
        this.convertButton = document.querySelector('#convert-button');

        this.setupWebSocket();
        this.convertButton.addEventListener('click', this.convert.bind(this));
    }

    setupWebSocket() {
        this.ws.onmessage = (event) => {
            let stockObject = JSON.parse(event.data);
            let bitcoinPrice = parseFloat(stockObject.p);
        }
    }

    convert() {
        let dollarAmount = parseFloat(this.dollarAmountInput.value);
        if (isNaN(dollarAmount) || dollarAmount <= 0) {
            alert('Por favor, ingrese un monto válido en dólares.');
            // Si el monto no es válido, deja el valor de Bitcoin vacío
            this.bitcoinValue.textContent = "";
            this.colonesValue.textContent = "";
            return;
        }

        this.ws.send(JSON.stringify({ "method": "SUBSCRIBE", "params": ["btcbusd@trade"], "id": 1 }));

        this.ws.onmessage = (event) => {
            let stockObject = JSON.parse(event.data);
            let bitcoinPrice = parseFloat(stockObject.p);
            let bitcoinResult = (dollarAmount / bitcoinPrice).toFixed(8);
            this.bitcoinValue.textContent = bitcoinResult + " BTC";

            let colonesResult = (dollarAmount * 8.75).toFixed(2);
            this.colonesValue.textContent = colonesResult + " SVC";
        }
    }
}

// Crear una instancia de la clase ConversorMoneda al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    new ConversorMoneda();
});