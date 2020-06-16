pragma solidity ^0.5.0;

contract Oracle{
    
/// quote structure
struct stock {
    uint price;
    uint volume;
}
/// quotes by symbol
mapping( bytes4 => stock) stockQuote;

/// Contract owner
address oracleOwner;

constructor() public{
    oracleOwner = msg.sender;
}

/// Set the value of a stock
function setStock(bytes4 symbol, uint price, uint volume) public {
        stock memory newStock;
        newStock.price = price;
        newStock.volume = volume;
        stockQuote[symbol] = newStock;
        require(msg.sender == oracleOwner, "Only oracleOwner can set the value of stock");
} 

function getStockPrice(bytes4 symbol) public view returns (uint) {
    return stockQuote[symbol].price;
}
/// Get the value of volume traded for a stock
function getStockVolume(bytes4 symbol) public view returns (uint) {
    return stockQuote[symbol].volume;
}

}
