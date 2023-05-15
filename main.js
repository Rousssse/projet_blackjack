// import d3 from './node_modules/d3.js'
import {loiUniforme} from './loi.js';
import { loiNormal } from './loi.js';
import { bernouilli } from './loi.js';
import { loiHyperGeometrique } from './loi.js';

const Pull = document.querySelector('#pull');
const Keep = document.querySelector('#keep');
const Split = document.querySelector('#split');
let playerCardsImages = document.getElementById("player-cards-images");
let playerCardsImagesHand2 = document.getElementById("player-cards-images-hand2");

let croupierCardsImages = document.getElementById("croupier-cards-images");

const dealerCardsElement = document.querySelector('#dealer-cards');
const playerCardsElement = document.querySelector('#player-cards');
const dealerScoreElement = document.querySelector('#dealer-score');
const playerScoreElement = document.querySelector('#player-score');
const secondCardsElement = document.querySelector('#second-cards');
const secondScoreElement = document.querySelector('#second-score');
const blackJackElement = document.querySelector('#blackjack');
const pairElement = document.querySelector('#paires');
let dealerScore = 0;
let playerScore = 0;
let secondScore = 0;
let handCount = 0;
let dealerTurn = false;
let gameOver = false;
const dealerCards = [];
const playerCards = [];
const playerHands = [];
const drawnCards = [];
const resultData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const resultDataDealer = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

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


function drawCard() {
    if (deck.length === 0) {
      console.log("Le paquet est vide!");
      return;
    }
    let newDeck = [];
    const nbr = loiUniforme(52-index) - 1;
    console.log ("nombre " ,nbr )
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

  dealerScore = 0;
  playerScore = 0;
  secondScore = 0;
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
  console.log('Nouvelle partie commencée.');
  console.log(deck);
  shuffleDeck(deck);
   
  dealerCardsElement.innerHTML = '';
  playerCardsElement.innerHTML = '';
  secondCardsElement.innerHTML = '';
  dealerScoreElement.textContent = dealerScore;
  playerScoreElement.textContent = playerScore;
  secondScoreElement.textContent = secondScore;

  playerCards.push(drawCard());
  dealerCards.push(drawCard());
  playerCards.push(drawCard());
  
  resultData[parseInt(playerCards[0].value) + parseInt(playerCards[1].value)-3] +=1;

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

  console.log("resultData" , resultData);
  croupierBlackJack();
  CroupierPair();
  dealerCards.push(drawCard());

  resultDataDealer[parseInt(dealerCards[0].value) + parseInt(dealerCards[1].value)-3] +=1;

  console.log(playerCards, "main joueur");
  console.log(dealerCards , "main dealer");

  const data = [];
  const dataDealer = [];

  for (let x = 3; x <= 21; x += 1) {
    const valeur = loiNormal(x,resultData);
    const valeurDealer = loiNormal(x,resultDataDealer);
    data.push({x : x, y: valeur});
    dataDealer.push({x : x, y: valeur});
    console.log("La Loi normal "+ valeur);
    barChart.data.datasets[0].data[x-3] = valeur;
    barChart.data.datasets[1].data[x-3] = valeurDealer;

  }


  barChart.update();

  // Update the HTML to display the cards
  dealerCardsElement.innerHTML = 'Cartes du croupier : ' + dealerCards[0].name + ' ' + '?';
  playerCardsElement.innerHTML = 'Vos cartes : ' + playerCards[0].name + ' ' + playerCards[1].name;
  console.log("score croupier : ", parseInt(dealerCards[0].value));
  console.log("score joueur : ",parseInt(playerCards[0].value) + parseInt(playerCards[1].value));
  playerScore = getHandValue(playerCards);
  updateScores();
});

function getHandValue(cards) {
  let sum = 0;
  let numAces = 0;

  // Calcule la valeur de la main en ajoutant la valeur de chaque carte
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

  // Ajuste la valeur des As si nécessaire
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
    console.log(playerScore , "gethandvalueplayercards");
    console.log(playerCardsElement);
    playerCardsElement.innerHTML += ' ' + card.name;
    
    var img1 = document.createElement("img");
    img1.src = "images/cards/fronts/"+playerCards[playerCards.length-1].suit+"_"+playerCards[playerCards.length-1].name+".svg";
    playerCardsImages.appendChild(img1);
  }
  else if( secondScore !=0 && handCount === 1){
    const secondcard = drawCard();
    console.log(secondcard);
    console.log(secondScore);
    playerHands.push(secondcard);
    console.log(playerHands)
    secondScore = getHandValue(playerHands);
    console.log(secondScore, "gethandvalueplayerhands");
    console.log(secondCardsElement);
    secondCardsElement.innerHTML += ' ' + secondcard.name;

    var imgHand = document.createElement("img");
    imgHand.src = "images/cards/fronts/"+secondcard.suit+"_"+secondcard.name+".svg";
    playerCardsImagesHand2.appendChild(imgHand);

    }
    else if( handCount === 2){
      console.log(" non non non ");
      }
    updateScores();

    // Check if the player busts
    if (playerScore > 21) {
      playerScoreElement.innerHTML = 'Vous avez perdu ' + playerScore;
      handCount = 1;
    }
    if (secondScore > 21) {
      secondScoreElement.innerHTML = 'Vous avez perdu ' + secondScore;
      handCount = 2;
    }
    if(playerScore > 21 & secondScore > 21 || playerScore > 21 & secondScore === 0){
      console.log("je suis passé par ici ");
      gameOver = true;
    }
  }
});
  
Keep.addEventListener('click', () => {
  console.log("keep keep");
  if (!gameOver && !dealerTurn) {
    if(secondScore === 0 || secondScore > 21){
      dealerTurn = true;
      updateScores();
  
      // Reveal the dealer's facedown card
      dealerCardsElement.innerHTML = "Score Croupier 1 :";
      dealerCardsElement.innerHTML += ' ' + dealerCards[0].name;
      dealerCardsElement.innerHTML += ' ' + dealerCards[1].name;
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
        dealerCardsElement.innerHTML += ' ' + card.name;
        dealerScore = getHandValue(dealerCards);
  
        var newImgDealer = document.createElement("img");
        newImgDealer.src = "images/cards/fronts/"+card.suit+"_"+card.name+".svg";
        croupierCardsImages.appendChild(newImgDealer);
      }
  
      // Determine the winner
      if (dealerScore > 21 || playerScore > dealerScore) {
        playerScoreElement.textContent = 'Vous avez gagné ' + playerScore;
      } 
      else if (dealerScore === playerScore ){
        playerScoreElement.textContent = 'match nul ! ' + playerScore;
      }
        else if(dealerScore ===21){
          playerScoreElement.textContent = 'Vous avez perdu ' + playerScore;
          dealerScoreElement.textContent = "BLACKJACK "  + dealerScore;
        }
        else if (dealerScore > playerScore) {
          playerScoreElement.textContent = 'Vous avez perdu ' + playerScore;
        }
      
      dealerScoreElement.textContent = dealerScore; 
      gameOver = true;
    }
    if(handCount === 1 & secondScore != 0){
    dealerTurn = true;
    updateScores();

    // Reveal the dealer's facedown card
    dealerCardsElement.innerHTML = "Score Croupier 1 :";
    dealerCardsElement.innerHTML += ' ' + dealerCards[0].name;
    dealerCardsElement.innerHTML += ' ' + dealerCards[1].name;
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
      dealerCardsElement.innerHTML += ' ' + card.name;
      dealerScore = getHandValue(dealerCards);

      var newImgDealer = document.createElement("img");
      newImgDealer.src = "images/cards/fronts/"+card.suit+"_"+card.name+".svg";
      croupierCardsImages.appendChild(newImgDealer);
    }
    if(playerScore < 21){
    if (dealerScore > 21 || playerScore > dealerScore) {
      playerScoreElement.textContent = 'Vous avez gagné ' + playerScore;
    } 
    else if (dealerScore === playerScore ){
      playerScoreElement.textContent = 'match nul ! ' + playerScore;
    }
    else if(dealerScore ===21){
        playerScoreElement.textContent = 'Vous avez perdu ' + playerScore;
        dealerScoreElement.textContent = "BLACKJACK"  + dealerScore;
      }
    else if (dealerScore > playerScore) {
        playerScoreElement.textContent = 'Vous avez perdu ' + playerScore;
    }

  }
  if(secondScore < 21){
    if (dealerScore > 21 || secondScore > dealerScore) {
      secondScoreElement.textContent = 'Vous avez gagné ' + secondScore;
    } 
    else if (dealerScore === secondScore ){
      secondScoreElement.textContent = 'match nul !' + secondScore;
    }
    else if(dealerScore === 21){
        secondScoreElement.textContent = 'Vous avez perdu '+ secondScore;
        dealerScoreElement.textContent = "BLACKJACK" + dealerScore;
      }
    else if (dealerScore > secondScore) {
        secondScoreElement.textContent = 'Vous avez perdu ' + secondScore;
      }
  }

    dealerScoreElement.textContent = dealerScore; 
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
   console.log(secondScore);
   
   playerCardsImages.innerHTML = '';
   playerCardsImagesHand2.innerHTML = '';

   var img1Hand1 = document.createElement("img");
   img1Hand1.src = "images/cards/fronts/"+playerCards[0].suit+"_"+playerCards[0].name+".svg";
   var img2Hand1 = document.createElement("img");
   img2Hand1.src = "images/cards/fronts/"+playerCards[1].suit+"_"+playerCards[1].name+".svg";

   playerCardsImages.appendChild(img1Hand1);
   playerCardsImages.appendChild(img2Hand1);

   var img1Hand2 = document.createElement("img");
   img1Hand2.src = "images/cards/fronts/"+playerHands[0].suit+"_"+playerHands[0].name+".svg";
   var img2Hand2 = document.createElement("img");
   img2Hand2.src = "images/cards/fronts/"+playerHands[1].suit+"_"+playerHands[1].name+".svg";
   
   playerCardsImagesHand2.appendChild(img1Hand2);
   playerCardsImagesHand2.appendChild(img2Hand2);

   // Update the HTML to display the new hands
   playerCardsElement.innerHTML = 'Vos cartes : ' + playerCards[0].name + ' ' + playerCards[1].name;
   secondCardsElement.innerHTML = 'Vos cartes : ' + playerHands[0].name + ' ' + playerHands[1].name;

    updateScores();

 }
 
}
else{
  console.log("non non non interdit !");
}
  
});

function croupierBlackJack(){
  console.log( "oh les As !");
  if( playerCards[0].value === 11){
    if( dealerCards[0].value === 11){
      if(playerCards[1].value === 10){
        
        blackJackElement.innerHTML =  bernouilli(15/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  bernouilli(16/49,1) + '%';
      }
    }
    else if (dealerCards[0].value === 10){
      if(playerCards[1].value === 11){
        blackJackElement.innerHTML = bernouilli(2/49,1)+ '%';
      }
      else{
        blackJackElement.innerHTML =  bernouilli(3/49,1)+ '%';
      }
    }
    else {
      blackJackElement.innerHTML =   0 + '%';
    }
    
  }
  else if (playerCards[0].value === 10){
    if(dealerCards[0].value === 11){
      if(playerCards[1].value === 10){
        
        blackJackElement.innerHTML =  bernouilli(14/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  bernouilli(15/49,1) + '%';
      }
    }
    else if (dealerCards[0].value === 10){
      if(playerCards[1].value === 11){
        blackJackElement.innerHTML =  bernouilli(3/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  bernouilli(4/49,1) + '%';
      }
    }
    else {
      blackJackElement.innerHTML =  0  + '%';
    }
  }
  else {
    if(dealerCards[0].value === 11){
      if(playerCards[1].value === 10){
        
        blackJackElement.innerHTML =  bernouilli(15/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML =  bernouilli(16/49,1) + '%';
      }
    }
    else if (dealerCards[0].value === 10){
      if(playerCards[1].value === 11){
        blackJackElement.innerHTML =  bernouilli(3/49,1) + '%';
      }
      else{
        blackJackElement.innerHTML = bernouilli(4/49,1) + '%';
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
    console.log( "jsuis la 1 " );
  }
  else if(playerCards[0].name === dealerCards[0].name || playerCards[1].name === dealerCards[0].name ){
    pairElement.innerHTML = loiHyperGeometrique(2)*100 + '%';
    console.log( "jsuis la 2 " );
  }
  else {
    pairElement.innerHTML = loiHyperGeometrique(3)*100 + '%';
    console.log( "jsuis la 3 " );
  }
}

// loi uniforme pour shuffle le cartes + tirer une carte 
// loi bernouilli pour savoir blackjack croupier
// loi hypergeo pour pair croupier

const data = [];
// const label 

// // Calculer la densité de probabilité pour chaque point

// const canvas = document.createElement('canvas');
// document.body.appendChild(canvas);
const barCanvas = document.getElementById("barCanvas")
const labels = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
const dataChart = {
  labels: labels,
  datasets: [
  {
    label: 'Densité de probabilité joueur',
    data: [],
    backgroundColor: [
      'crimson'
    ],
  },
  {
    label: 'Densité de probabilité dealer',
    data: [],
    backgroundColor: [
      'blue'
    ],
  }
]
};
const barChart = new Chart(barCanvas, {
  type: 'bar',
  data: dataChart,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
});

//[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]

// new Chart(canvas.getContext('2d'), {
//   type: 'line',
//   data: {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Densité de probabilité',
//         data: data,
//       },
//     ],
//   },
// }); 



