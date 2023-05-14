

//Espérance de la loi uniforme, représente la valeur moyenne
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

function binomomiale(n, p) {
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

export function bernouilli(p,k){
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
function meanNormal(resultData){
    let sum = 0;
    let mains = 0;
    let mean = 0;
    for(let i = 0; i < resultData.length; i++ ){
        sum += resultData[i]*(i +3);
        mains += resultData[i];
    }
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

export function loiNormal(x,resultData){
    const mean = meanNormal(resultData);
    const ecarttype = ecartTypeNormal(resultData,mean);
    const pas = 0.1;
    const coeff = 1/(ecarttype * Math.sqrt(2* Math.PI));
    const exponentiel = -((x-mean) ** 2) / (2 * ecarttype ** 2);
    return coeff * Math.exp(exponentiel);

}

export function loiGeometrique(p){
    let U = Math.random();
    let k = Math.floor(Math.log(U) / Math.log(1 - p)) + 1;
    console.log( "proba : " +  k + "  U = "+ U);
    return k;     
}

export function loiHyperGeometrique(cardsofvalueleft){
    let numerator = binomomiale(cardsofvalueleft,1) * binomomiale(49-cardsofvalueleft,0);
    let denominator = binomomiale(49,1);
    let proba = numerator / denominator;
    console.log(proba *100);
    return proba;
}