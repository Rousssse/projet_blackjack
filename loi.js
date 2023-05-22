/* Abstrait 6 */

//loiUniforme

function esperanceUniforme(N) {
	return (N + 1) / 2
}

export function loiUniforme(N) {
	let sommeK = 0;
	let U = Math.random() ;
	let k = 0;

	while (U > sommeK) {
		sommeK += 1 / N;
		k++;
	}
	return (k);
}
//-----------------------------------------------------------------------------------------------

//loiPoisson

function fact(nbr) {
	var i, nbr, f = 1;
	for (i = 1; i <= nbr; i++) {
		f = f * i;   // ou f *= i;
	}
	return f;
}

function esperancePoisson(lambda) {
	return lambda
}

export function loiPoisson(lambda) {
	let Sk = 0;
	let U = Math.random() ;
	let k = 0;
	let prob = (Math.pow(lambda, k) * Math.exp(-lambda))/ fact(k);

	while (U > Sk) {
		Sk += prob;
        k++;
		
		prob = (Math.pow(lambda, k) * Math.exp(-lambda))/ fact(k);
	}
	return k;
}
//------------------------------------------------------------------------------------

//loiLogistique

export function loiLogistique(x,y) {
	const X = Math.random();
	const res = Math.round(Math.abs(y*Math.log2(X/(1-X)) + x))
	return res;
}
//---------------------------------------------

//loiBeta
function espBeta(a, b) {
	return a / (a + b)
}

function varBeta(a, b) {
	const numerator = a * b;
	const denominator = Math.pow(a + b, 2) * (a + b + 1);
	return numerator / denominator;
}

export function loiBeta(a, b) {
	const MAX_ITERATIONS = 10000;
	let iteration = 0;

	while (iteration < MAX_ITERATIONS) {
		const u = Math.random(); 
		const v = Math.random(); 

		const x = Math.pow(u, 1 / a);
		const y = Math.pow(v, 1 / b);

		if (x + y <= 1) {
			let result = x / (x + y)


			result = Math.round(result * 100)
			return result;
		}

		iteration++;
	}

	console.error("Fail");
	return null;
}
//--------------------------------------------------------------

//loiExponentielle
export function loiExponentielle(taux){
	const X = Math.random();
	const expo = Math.floor(-Math.log(1 - X)/taux);
	return Math.max(0, Math.min(255, expo));

}
//------------------------------

//loiNormale
export function loiNormale(min,max){
	const mean = (min+max)/2;
	const ecart = 5;
	const X = Math.random();
    var normal = mean + ecart * Math.sqrt(-2 * Math.log(X)) * Math.cos(2 * Math.PI * X);
  
  // Limit the value between [min, max]
  normal = Math.max(min, Math.min(max, normal));
  
  return Math.floor(normal*1000);

}
//--------------------------------------------

/* Concret 2 */

//loiBernouilli
export function loiBernouilli(p,k){
    if(k === 1){
        return p*100;
    }
    else if (k === 0) {
        return (1 - p)*100;
      } 
    else {
        return undefined;
      }
    
}

//-------------------------------------------------------

//loiBinomiale
function prob_binom(k, n, p) {
	return (fact(n) / (fact(k) * fact(n - k))) * Math.pow(p, k) * Math.pow((1 - p), (n - k))
}

function loiBinomiale(n, p) {
	let Sk = 0
	let U = Math.random() //U entre 0 et 1 
	let k = 0

	while (U > Sk) {
		Sk += prob_binom(k, n, p)
		k++

	}
	console.log("U= ", U, "k= ", k)
	return k
}
//---------------------------------------

//loiHyperGeometrique
export function loiHyperGeometrique(cardsOfValueLeft){
    let numerator = loiBinomiale(cardsOfValueLeft,1) * loiBinomiale(49-cardsOfValueLeft,0);
    let denominator = loiBinomiale(49,1);
    let probability = numerator / denominator;
    console.log(probability *100);
    return probability;
}
//------------------------------------------------------





