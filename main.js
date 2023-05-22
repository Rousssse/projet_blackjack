import {loiExponentielle, loiNormale, loiUniforme, loiBernouilli, loiHyperGeometrique,loiPoisson,loiBeta,loiLogistique} from './loi.js';
//Button 
const Pull = document.querySelector('#pull');
const Keep = document.querySelector('#keep');
const Split = document.querySelector('#split');
//Images
let playerCardsImages = document.getElementById("player-cards-images");
let playerCardsImagesHand2 = document.getElementById("player-cards-images-hand2");
let croupierCardsImages = document.getElementById("croupier-cards-images");
// display the score
const dealerScoreElement = document.querySelector('#dealer-score');
const playerScoreElement = document.querySelector('#player-score');
const secondScoreElement = document.querySelector('#second-score');
var DealerScore = document.getElementById("dealer-score");
var SecondScore = document.getElementById("second-score");
//set the beginning of the page
var GameContainer = document.getElementById("game-container");
GameContainer.style.display = "none";
var ActionContainer = document.getElementById("action-container");
ActionContainer.style.display = "none";
var StatsContainer = document.getElementById("stats-container");
StatsContainer.style.display = "none";
// display the % for the dealer to have a blackjack and % for the dealer to have a pair
const blackJackElement = document.querySelector('#blackjack');
const pairElement = document.querySelector('#pairs');
//data
let dealerScore;
let playerScore = 0;
let secondScore = 0;
let handCount = 0;
let dealerTurn = false;
let gameOver = false;
//tab with cards
const dealerCards = [];
const playerCards = [];
const playerHands = [];
const drawnCards = [];
// deck of cards
let deck = [];
let index = 0;
const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor((loiUniforme(100)/100) * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

//use of loiPoisson
function changeOpacity(){
  var Opacity = loiPoisson(5)/10;
  var PlayerCard = document.getElementById("player-cards-images");
  var PlayerScore = document.getElementById("player-score");
  PlayerCard.style.opacity = Opacity;
  PlayerScore.style.opacity = Opacity;
  console.log(Opacity, "opacity");
}
// use of loiLogistique, loiBeta, loiExponentielle
function changeBackgroundColor(){
  var Color1 = loiLogistique(127.5,25);
  var Color2 = loiBeta(0.5,0.5);
  var Color3 = loiExponentielle(0.011);
  console.log("color1",Color1);
  console.log("color2",Color2);
  console.log("color3",Color3);
  var backgroundColor = document.getElementById("game-color");
  backgroundColor.style.background = "linear-gradient(to right, rgb(" + Color1 + ", " + Color2 + ", " + Color3 + "), rgb(" + Color3 + ", " + Color1 + ", " + Color2 + "))";

}
//use of loiNormal
function timeOut(){
  var imgHidden = document.createElement("img");
  var imgHidden2 = document.createElement("img");
  imgHidden.src = "images/cards/fronts/red.svg";
  imgHidden2.src = "images/cards/fronts/red.svg";
  while (playerCardsImages.firstChild) {
    playerCardsImages.removeChild(playerCardsImages.firstChild);
  }
  playerCardsImages.appendChild(imgHidden);
  playerCardsImages.appendChild(imgHidden2);
}


function drawCard() {
    let newDeck = [];
    const nbr = loiUniforme(52-index) - 1;
    console.log ("number " ,nbr )
    const card = deck[nbr];
    drawnCards.push(card);
    console.log( "carte tire" , card);
    newDeck = deck.slice(0,nbr).concat(deck.slice(nbr+1));
    deck = newDeck;
    console.log(deck);
    index ++;
    console.log(" index " , index);
    return {name: card.name, value : card.value, suit : card.suit};
  }
  

draw.addEventListener('click', () => {

  GameContainer.style.display = "";
  StatsContainer.style.display = "";
  ActionContainer.style.display = "";
  dealerScore = 0;
  DealerScore.style.opacity = 0;
  playerScore = 0;
  secondScore = 0;
  SecondScore.style.opacity = 0;
  dealerTurn = false;
  gameOver = false;
  dealerCards.length = 0;
  playerCards.length = 0;
  playerHands.length = 0;
  index = 0;
  handCount = 0;
  deck.splice(0,52);
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      const card = {suit: suits[i], name: cards[j], value: values[j] };
      deck.push(card);
    }
  }
  console.log('new party');
  shuffleDeck(deck);
   
  dealerScoreElement.textContent = dealerScore;
  playerScoreElement.textContent = playerScore;
  secondScoreElement.textContent = secondScore;

  playerCards.push(drawCard());
  dealerCards.push(drawCard());
  playerCards.push(drawCard());
  
  changeOpacity();
  changeBackgroundColor();

  playerCardsImagesHand2.innerHTML = '';
  
  playerCardsImages.innerHTML = '';
  var img1 = document.createElement("img");
  img1.src = "images/cards/fronts/"+playerCards[0].suit+"_"+playerCards[0].name+".svg";
  var img2 = document.createElement("img");
  img2.src = "images/cards/fronts/"+playerCards[1].suit+"_"+playerCards[1].name+".svg";

  playerCardsImages.appendChild(img1);
  playerCardsImages.appendChild(img2);

  croupierCardsImages.innerHTML = '';
  var imgDealer = document.createElement("img");
  imgDealer.src = "images/cards/fronts/"+dealerCards[0].suit+"_"+dealerCards[0].name+".svg";
  var imgHidden = document.createElement("img");
  imgHidden.src = "images/cards/fronts/red.svg";
  croupierCardsImages.appendChild(imgDealer);

  croupierCardsImages.appendChild(imgHidden);

  croupierBlackJack();
  CroupierPair();
  dealerCards.push(drawCard());

  console.log(playerCards, "hand player");
  console.log(dealerCards , "hand player");

  console.log("score player : ",parseInt(playerCards[0].value) + parseInt(playerCards[1].value));
  playerScore = getHandValue(playerCards);
  var Normal = loiNormale();
  console.log(Normal, " loi normal");
  setTimeout(timeOut,Normal);
  updateScores();

});

function getHandValue(cards) {
  let sum = 0;
  let numAces = 0;

  // Calculate the value of the hand by adding the value of each card
  for (let card of cards) {
    if (card.value === 1 || card.value === 11) {
      numAces++;
      sum += 11;
    } else if (card.value >= 10) {
      sum += 10;
    } else {
      sum += card.value;
    }
  }

  // Change the value of Aces if needed 
  while (sum > 21 && numAces > 0) {
    sum -= 10;
    numAces--;
  }

  return sum;
}

function updateScores() {
  if (dealerScoreElement) {
    dealerScoreElement.textContent = dealerScore;
  }
  if (playerScoreElement) {
    playerScoreElement.textContent = playerScore;
  }
  if(secondScoreElement){
    secondScoreElement.textContent = secondScore;
  }
}


// Handle the player clicking the "Hit" button
Pull.addEventListener('click', () => {
  console.log("pull pull");
  if (!gameOver && !dealerTurn) {
    console.log(handCount);
    // Draw a card for the player
    if(handCount === 0){
    const card = drawCard();
    console.log(card);
    console.log(playerScore);
    playerCards.push(card);
    playerScore = getHandValue(playerCards);
    
    var img1 = document.createElement("img");
    img1.src = "images/cards/fronts/"+playerCards[playerCards.length-1].suit+"_"+playerCards[playerCards.length-1].name+".svg";
    playerCardsImages.appendChild(img1);
  }
  else if( secondScore !=0 && handCount === 1){
    const secondCard = drawCard();
    console.log(secondCard);
    console.log(secondScore);
    playerHands.push(secondCard);
    console.log(playerHands)
    secondScore = getHandValue(playerHands);
    console.log(secondScore, "secondScore");

    var imgHand = document.createElement("img");
    imgHand.src = "images/cards/fronts/"+secondCard.suit+"_"+secondCard.name+".svg";
    playerCardsImagesHand2.appendChild(imgHand);

    }
    else if( handCount === 2){
      console.log(" non non non ");
      }
    updateScores();

    // Check if the player busts
    if (playerScore > 21) {
      playerScoreElement.innerHTML = playerScore;
      setTimeout(function() {
        alert("You Lose / Busted !");
      }, 100);
      handCount = 1;
    }
    if (secondScore > 21) {
      secondScoreElement.innerHTML = secondScore;
      setTimeout(function() {
        alert("You Lose / Busted on Second Hand !");
      }, 100);
      handCount = 2;
    }
    if(playerScore > 21 & secondScore > 21 || playerScore > 21 & secondScore === 0){
      gameOver = true;
    }
  }
});
  
Keep.addEventListener('click', () => {
  console.log("keep keep");
  if (!gameOver && !dealerTurn) {
    if(secondScore === 0 || secondScore > 21){
      dealerTurn = true;
      DealerScore.style.opacity = 1;
      updateScores();
  
      dealerScore = getHandValue(dealerCards);
  
      croupierCardsImages.innerHTML = '';
      var imgDealer = document.createElement("img");
      imgDealer.src = "images/cards/fronts/"+dealerCards[0].suit+"_"+dealerCards[0].name+".svg";
      var imgHidden = document.createElement("img");
      imgHidden.src = "images/cards/fronts/"+dealerCards[1].suit+"_"+dealerCards[1].name+".svg";
      croupierCardsImages.appendChild(imgDealer);
    
      croupierCardsImages.appendChild(imgHidden);

      // Dealer draws cards until their score is 17 or higher
      while (dealerScore < 17) {
        const card = drawCard();
        dealerCards.push(card);
        // dealerCardsElement.innerHTML += ' ' + card.name;
        dealerScore = getHandValue(dealerCards);
  
        var newImgDealer = document.createElement("img");
        newImgDealer.src = "images/cards/fronts/"+card.suit+"_"+card.name+".svg";
        croupierCardsImages.appendChild(newImgDealer);
      }
  
      // Determine the winner
      if (dealerScore > 21 || playerScore > dealerScore) {
        playerScoreElement.textContent = playerScore;
        dealerScoreElement.textContent = dealerScore; 
        setTimeout(function() {
          alert("You Win !");
        }, 100);
      } 
      else if (dealerScore === playerScore ){
        playerScoreElement.textContent =  playerScore;
        dealerScoreElement.textContent = dealerScore; 
        setTimeout(function() {
          alert(" Draw !");
        }, 100);
      }
        else if(dealerScore === 21){
          playerScoreElement.textContent = playerScore;
          dealerScoreElement.textContent = dealerScore; 
          setTimeout(function() {
            alert(" You Lose !");
          }, 100);
        }
        else if (dealerScore > playerScore) {
          playerScoreElement.textContent =  playerScore;
          dealerScoreElement.textContent = dealerScore; 
          setTimeout(function() {
            alert(" You Lose !");
          }, 100);
        }
      
      // dealerScoreElement.textContent = dealerScore; 
      gameOver = true;
    }
    if(handCount === 1 & secondScore != 0){
    dealerTurn = true;
    DealerScore.style.opacity = 1;
    updateScores();

    // Reveal the dealer's facedown card
    dealerScore = getHandValue(dealerCards);

    croupierCardsImages.innerHTML = '';
    var imgDealer = document.createElement("img");
    imgDealer.src = "images/cards/fronts/"+dealerCards[0].suit+"_"+dealerCards[0].name+".svg";
    var imgHidden = document.createElement("img");
    imgHidden.src = "images/cards/fronts/"+dealerCards[1].suit+"_"+dealerCards[1].name+".svg";
    croupierCardsImages.appendChild(imgDealer);
    croupierCardsImages.appendChild(imgHidden);

    // Dealer draws cards until their score is 17 or higher
    while (dealerScore < 17) {
      const card = drawCard();
      dealerCards.push(card);
      dealerScore = getHandValue(dealerCards);

      var newImgDealer = document.createElement("img");
      newImgDealer.src = "images/cards/fronts/"+card.suit+"_"+card.name+".svg";
      croupierCardsImages.appendChild(newImgDealer);
    }
    if(playerScore < 21){
    if (dealerScore > 21 || playerScore > dealerScore) {
      playerScoreElement.textContent = playerScore;
      dealerScoreElement.textContent = dealerScore; 
      setTimeout(function() {
        alert(" You Win ! Hand 1");
      }, 100);
    } 
    else if (dealerScore === playerScore ){
      playerScoreElement.textContent = playerScore;
      dealerScoreElement.textContent = dealerScore; 
      setTimeout(function() {
        alert(" Draw ! Hand 1");
      }, 100);
    }
    else if(dealerScore ===21){
        playerScoreElement.textContent = playerScore;
        dealerScoreElement.textContent = dealerScore;
        setTimeout(function() {
          alert(" You Lose ! Hand 1");
        }, 100);
      }
    else if (dealerScore > playerScore) {
        playerScoreElement.textContent = playerScore;
        dealerScoreElement.textContent = dealerScore; 
        setTimeout(function() {
          alert(" You Lose ! Hand 1");
        }, 100);
    }

  }
  if(secondScore < 21){
    if (dealerScore > 21 || secondScore > dealerScore) {
      secondScoreElement.textContent = secondScore;
      dealerScoreElement.textContent = dealerScore; 
      setTimeout(function() {
        alert(" You Win ! Hand 2");
      }, 100);
    } 
    else if (dealerScore === secondScore ){
      secondScoreElement.textContent = secondScore;
      dealerScoreElement.textContent = dealerScore; 
      setTimeout(function() {
        alert(" Draw ! Hand 2");
      }, 100);
    }
    else if(dealerScore === 21){
        secondScoreElement.textContent = secondScore;
        dealerScoreElement.textContent = dealerScore;
        setTimeout(function() {
          alert(" You Lose ! Hand 2");
        }, 100);
      }
    else if (dealerScore > secondScore) {
        secondScoreElement.textContent = secondScore;
        dealerScoreElement.textContent = dealerScore; 
        setTimeout(function() {
          alert(" You Lose ! Hand 2");
        }, 100);
      }
  }

    // dealerScoreElement.textContent = dealerScore; 
    gameOver = true;
  }
}
handCount += 1;
});

Split.addEventListener('click', () => {
  if( playerCards[0].value == playerCards[1].value){
  console.log("split split");
  if (!gameOver && !dealerTurn) {
    const hand1card1 = playerCards[0];
    const hand1card2 = drawCard();
    const hand2card1 = playerCards[1];
    const hand2card2 = drawCard();
   // Remove the split cards from the original hand
   playerCards.splice(0, 2);

   // Add the split cards to the new hands
   playerCards.push(hand1card1);
   playerCards.push(hand1card2);
   console.log(playerCards);
   playerScore = getHandValue(playerCards);
   console.log(playerScore);

   playerHands.push(hand2card1);
   playerHands.push(hand2card2);
   console.log(playerHands);
   secondScore = getHandValue(playerHands);
   SecondScore.style.opacity = 1;
   console.log(secondScore);
   
   playerCardsImages.innerHTML = '';
   playerCardsImagesHand2.innerHTML = '';

   var img1Hand1 = document.createElement("img");
   img1Hand1.src = "images/cards/fronts/"+playerCards[0].suit+"_"+playerCards[0].name+".svg";
   var img2Hand1 = document.createElement("img");
   img2Hand1.src = "images/cards/fronts/"+playerCards[1].suit+"_"+playerCards[1].name+".svg";
   var img1Hand2 = document.createElement("img");
   img1Hand2.src = "images/cards/fronts/"+playerHands[0].suit+"_"+playerHands[0].name+".svg";
   var img2Hand2 = document.createElement("img");
   img2Hand2.src = "images/cards/fronts/"+playerHands[1].suit+"_"+playerHands[1].name+".svg";

   playerCardsImages.appendChild(img1Hand1);
   playerCardsImages.appendChild(img2Hand1);
   playerCardsImagesHand2.appendChild(img1Hand2);
   playerCardsImagesHand2.appendChild(img2Hand2);

    updateScores();

 }
 
}
else{
  console.log("Impossible not the same value !");
}
  
});

function croupierBlackJack(){
  console.log( "oh les As !");
  if( playerCards[0].value === 11){
    if( dealerCards[0].value === 11){
      if(playerCards[1].value === 10){
        
        blackJackElement.innerHTML =  loiBernouilli(15/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  loiBernouilli(16/49,1) + '%';
      }
    }
    else if (dealerCards[0].value === 10){
      if(playerCards[1].value === 11){
        blackJackElement.innerHTML = loiBernouilli(2/49,1)+ '%';
      }
      else{
        blackJackElement.innerHTML =  loiBernouilli(3/49,1)+ '%';
      }
    }
    else {
      blackJackElement.innerHTML =   0 + '%';
    }
    
  }
  else if (playerCards[0].value === 10){
    if(dealerCards[0].value === 11){
      if(playerCards[1].value === 10){
        
        blackJackElement.innerHTML =  loiBernouilli(14/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  loiBernouilli(15/49,1) + '%';
      }
    }
    else if (dealerCards[0].value === 10){
      if(playerCards[1].value === 11){
        blackJackElement.innerHTML =  loiBernouilli(3/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  loiBernouilli(4/49,1) + '%';
      }
    }
    else {
      blackJackElement.innerHTML =  0  + '%';
    }
  }
  else {
    if(dealerCards[0].value === 11){
      if(playerCards[1].value === 10){
        
        blackJackElement.innerHTML =  loiBernouilli(15/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  loiBernouilli(16/49,1) + '%';
      }
    }
    else if (dealerCards[0].value === 10){
      if(playerCards[1].value === 11){
        blackJackElement.innerHTML =  loiBernouilli(3/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML = loiBernouilli(4/49,1) + '%';
      }
    }
    else {
      blackJackElement.innerHTML = 0 + '%';
    }
  }
}

function CroupierPair(){
  if(playerCards[0].name === dealerCards[0].name & playerCards[1].name === dealerCards[0].name ){
    pairElement.innerHTML =  loiHyperGeometrique(1)*100+ '%';
  }
  else if(playerCards[0].name === dealerCards[0].name || playerCards[1].name === dealerCards[0].name ){
    pairElement.innerHTML = loiHyperGeometrique(2)*100 + '%';
  }
  else {
    pairElement.innerHTML = loiHyperGeometrique(3)*100 + '%';
  }
}





