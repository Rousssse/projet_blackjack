function fact(nbr) {
	var i, nbr, f = 1;
	for (i = 1; i <= nbr; i++) {
		f = f * i;   // ou f *= i;
	}
	return f;
}

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
	// console.log("U = ", U, "probabilité uniforme : ", k/100, "Espérance = ", esperanceUniforme(N));
	return (k);
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

	console.log("U = ", U, "proba poisson : ", k, "Espérance = ", esperancePoisson(lambda))
	return k;
}
function prob_binom(k, n, p) {
	return (fact(n) / (fact(k) * fact(n - k))) * Math.pow(p, k) * Math.pow((1 - p), (n - k))
}

function loiBinomomiale(n, p) {
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
 export function meanNormal(resultData){
    let sum = 0;
    let mains = 0;
    let mean = 0;
        sum = resultData[7]*(7 +3);
        mains = resultData[7];
    mean = sum / mains;
    return mean;
}

function ecartTypeNormal( resultData, mean){
    let sum = 0;
    let mains = 0;
    let ecarttype =0;
    let variance = 0;
    for (let i = 0; i< resultData.length; i++){
        sum += resultData[i] * ((i+3) - mean)* ((i+3) - mean);
        mains += resultData[i];
    }
    
    variance = sum / mains;
    ecarttype = Math.sqrt(variance);
    return ecarttype;
}

function loiNormal(x,resultData){
    const mean = meanNormal(resultData);
    const ecarttype = ecartTypeNormal(resultData,mean);
    const coeff = 1/(ecarttype * Math.sqrt(2* Math.PI));
    const exponentiel = -((x-mean) ** 2) / (2 * ecarttype ** 2);
    return coeff * Math.exp(exponentiel);

}
export function loiNormale(){
	const mean = 13;
	const ecart = 5;
	const U = Math.random();
  var  normal = mean + ecart * Math.sqrt(-2 * Math.log(U)) * Math.cos(2 * Math.PI * U);
  
  // Limiter la valeur dans l'intervalle [10, 30]
  normal = Math.max(6, Math.min(20, normal));
  
  return Math.floor(normal*1000);

}

export function loiGeometrique(p){
    let U = Math.random();
    let k = Math.floor(Math.log(U) / Math.log(1 - p)) + 1;
    console.log( "proba : " +  k + "  U = "+ U);
    return k;     
}

export function loiHyperGeometrique(cardsofvalueleft){
    let numerator = loiBinomomiale(cardsofvalueleft,1) * loiBinomomiale(49-cardsofvalueleft,0);
    let denominator = loiBinomomiale(49,1);
    let proba = numerator / denominator;
    console.log(proba *100);
    return proba;
}

export function loiLogistique(position,echelle) {
	const U = Math.random();
	const res = Math.round(Math.abs(echelle*Math.log2(U/(1-U)) + position))

	console.log("U =", U, "proba logistique:", res);
	return res;
}

export function loiExponentielle(taux){
	const U = Math.random();
	const expo = Math.floor(-Math.log(1 - U)/taux);
	return Math.max(0, Math.min(255, expo));

}

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

			console.log("U = ", u, " V = ", v, "loi beta : ", result, "Espérance = ", espBeta(a, b), "Variance = ", varBeta(a, b))
			return result;
		}

		iteration++;
	}

	console.error("Fail");
	return null;
}
