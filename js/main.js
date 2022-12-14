
let canvas, c, 	invaders, 	w, 	h, 	dt,	player, lives, lastUpdate, div, generation;

canvas = document.createElement('canvas');
canvas.width = w = 240;
canvas.height = h = 480;
c = canvas.getContext('2d',{alpha: false});
if (window.devicePixelRatio > 1) {
	c.canvas.width = c.canvas.width * window.devicePixelRatio;
	c.canvas.height = c.canvas.height * window.devicePixelRatio;
	c.canvas.style.width = w+'px';
	c.canvas.style.height = h+'px';
	c.scale(window.devicePixelRatio, window.devicePixelRatio);
}
 div = document.createElement('div');

function init(){
	lives = 0;
	generation = 1;
	dt = 0;
	lastUpdate = Date.now();
	canvas.style.border = "solid";
	document.body.appendChild( canvas );
	document.body.appendChild( div );
	invaders = new Genetics();
	invaders.createPopulation();
	player = new Player( w/4/2, h/4-4 );
	update();
}

function deltaTime(){
	let now = Date.now();
	dt = now - lastUpdate;
	lastUpdate = now;
}

function getBestOfGeneration(){
	let index = 0, best = 0;
	for(let i = 0; i < invaders.population.length; i++){
		if( invaders.population[i].fit > best ){
			best = invaders.population[i].fit;
			index = i;
		}
	}
	if( !invaders.bestOfGeneration || invaders.population[index].fit > invaders.bestOfGeneration.fit ){
		invaders.bestOfGeneration = invaders.population[index];
	}
}

function gameOver(){
	c.fillStyle = "white";
	c.fillRect(0,0,w,h);
	c.fillStyle = "black";
	c.font = "10px Arial";
	c.fillText("Generation: "+generation, 5, 10);
	c.fillText("Monsters: "+lives, 5, 20);
	let txt = "Game Over!";
	c.font = "30px Arial";
	c.fillText(txt, (w-c.measureText(txt).width)/2, h/2);
}

function update(){
	c.fillStyle = "white";
	c.fillRect(0,0,w,h);
	c.fillStyle = "black";
	c.font = "10px Arial";
	c.fillText("Generation: "+generation, 5, 10);
	c.fillText("Monsters: "+lives, 5, 20);
	
	for(let i = 0; i < invaders.population.length; i++){
		invaders.population[i].show();
	}
	player.show();
	let allDead = true;
	for(let i = 0; i < invaders.population.length; i++){
		if( invaders.population[i].isAlive ){
			allDead = false;
			break;
		}
	}
	if(allDead){
		getBestOfGeneration();
		if(generation%7){
			invaders.evolve();
		}else{
			invaders.elitism();
		}
		generation++;
	}
	if(lives > 4){
		gameOver();
		return;
	}
	deltaTime();
	requestAnimationFrame(update);
}

function addEvents(){
	document.addEventListener("keydown",function(e){
		switch(e.keyCode){
			case 13 :
					init();
				break;
			case 32 :
					player.shoot();
				break;
			case 37 :
			case 65 :
					player.isMovingLeft = true;
				break;
			case 39 :
			case 68 :
					player.isMovingRight = true;
				break;
		}
	});

	document.addEventListener("keyup",function(e){
		switch(e.keyCode){
			case 37 :
			case 65 :
					player.isMovingLeft = false;
				break;
			case 39 :
			case 68 :
					player.isMovingRight = false;
				break;
		}
	});

	window.addEventListener("focus",function(){
		lastUpdate = Date.now();
	});

	
}

addEvents();
init();

