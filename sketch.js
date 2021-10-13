var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex ,trexCorrendo, bordas, solo, imagemSolo, soloInvisivel,obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6, pontuacao, grupoObstaculos, grupoNuvens, trexColidiu, gameOverImg, reiniciarImg, gameOver, reiniciar;

var somSalto, somMorte, somPontos;

function preload(){ 
  
  trexCorrendo = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  
  imagemSolo = loadImage("ground2.png");
  
  imagemNuvem = loadImage("cloud2.png");
  
  trexColidiu = loadAnimation("trex_collided.png");
  
  gameOverImg = loadImage("gameOver.png");
  
  reiniciarImg = loadImage("restart.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somPontos = loadSound("checkPoint.mp3");
  
}

function setup(){
  
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trexCorrendo);
  trex.addAnimation("colidiu", trexColidiu);
  trex.scale = 0.5;
  
  solo = createSprite(width/2,height-20,width,20);
  solo.addImage("solo", imagemSolo);
  solo.x = solo.width/2;
  
  soloInvisivel = createSprite(width/2, height-10,width,10);
  soloInvisivel.visible = false;

  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  gameOver.scale = 0.5;
  
  reiniciar = createSprite(width/2,height/2 + 50);
  reiniciar.addImage(reiniciarImg);
  reiniciar.scale = 0.5;
  reiniciar.visible = false;
  
  grupoObstaculos = new Group();
  grupoNuvens = new Group();
  
  bordas = createEdgeSprites();
  
  //console.log("oi "+5);
  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true;
  
  pontuacao = 0;
}

function draw(){
  background(240);
  
  text("Pontuacao: "+ pontuacao, width/2 -50,height-500);
  
  if (estadoJogo === JOGAR){
    solo.velocityX = - (4 + 3*pontuacao/100);
    pontuacao = pontuacao + Math.round((frameRate()/60));
      if(pontuacao > 0 && pontuacao%100 === 0){
      somPontos.play();
    }
    
     if(solo.x < 0){
    solo.x = solo.width/2;
     }
         if(touches.length > 0 && trex.y > height- 60|| keyDown("space") && trex.y >= 150){
    trex.velocityY = -12;
           somSalto.play();
           touches = [];
  }
    trex.velocityY = trex.velocityY+0.6;
    
     criarNuvens();
    
    gerarObstaculos();
    
    if(grupoObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      somMorte.play();
    }
  }
  else if(estadoJogo === ENCERRAR){
    
    gameOver.visible = true;
    reiniciar.visible = true;
    
    solo.velocityX = 0;
    trex.velocityY = 0;
    
    trex.changeAnimation("colidiu");
    
    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    
     if(mousePressedOver(reiniciar)||touches.length > 0){
    reset();
    touches= [];
  }
  }
  
  trex.collide(soloInvisivel);
 
  drawSprites();

}
function gerarObstaculos(){
  if(frameCount % 60 === 0){
    var obstaculo = createSprite(width,height-30,10,40);
    obstaculo.velocityX = - (6 + pontuacao/100);
    
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
        break;
      case 2: obstaculo.addImage(obstaculo2);
        break;
      case 3: obstaculo.addImage(obstaculo3);
        break;
      case 4: obstaculo.addImage(obstaculo4);
        break;
      case 5: obstaculo.addImage(obstaculo5);
        break;
      case 6: obstaculo.addImage(obstaculo6);
        break;
        default: break;
    }
    
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 200;
    
    grupoObstaculos.add(obstaculo);
}
}

function criarNuvens(){
  if(frameCount % 60 === 0){
  var nuvem = createSprite(600, 100, 40, 10);
    nuvem.addImage(imagemNuvem);
    nuvem.scale = 0.5;
    nuvem.y = Math.round(random(height-100,height-300));
    nuvem.velocityX = -6;
    
    nuvem.lifetime = 200;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth++;
    
    grupoNuvens.add(nuvem);
  }
  
}
function reset(){
  estadoJogo = JOGAR;
  gameOver.visible = false;
  reiniciar.visible = false;
  
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  
  trex.changeAnimation("running");
  
  pontuacao = 0;
}