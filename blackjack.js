function getQueryVariable(variable) {
    var x = "";
    var z = 0;
    for (let i = 14; i < queryInput.length; i++) {
        x += queryInput[i];
    }
    for (let i = 0; i < x.length; i++) {
        x = x.replace("+", " ");
    }
    x += ":";
    return x;
}

var queryInput = window.location.search.toString();
var halfParsedName = getQueryVariable(queryInput);
var parsedName = halfParsedName.substring(0, halfParsedName.length - 1);
document.getElementById("name").innerHTML = getQueryVariable(queryInput);

var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
    let types = ["_of_clubs", "_of_diamonds", "_of_hearts", "_of_spades"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random()*deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    console.log(deck);
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./img/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./img/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    if (canHit == true) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./img/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    
    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./img/" + hidden + ".png";
    let message = "";

    if (yourSum > 21) {
        message = parsedName + " loses!";
    } else if (yourSum > dealerSum) {
        message = parsedName + " wins!"; 
    } else if (dealerSum > 21) {
        message = parsedName + " wins!"; 
    } else if (yourSum == dealerSum) {
        message = "Tie!";
    } else if (yourSum < dealerSum) {
        message = parsedName + " loses!";
    }

    document.getElementById("results").innerText = message;
}

function reduceAce(sum, aceCount) {
    while (aceCount > 0 && sum > 21) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}

function getValue(card) {
    let data = card.split("_");
    if (isNaN(data[0])) {
        if (data[0] == "ace") {
            return 11;
        } else {
            return 10;
        }
    } else {
        return parseInt(data[0]); 
    }
}

function checkAce(card) {
    let data = card.split("_");
    if (data[0] == "ace") {
        return 1;
    } else {
        return 0;
    }
}