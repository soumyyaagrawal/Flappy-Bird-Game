//board
let board;
let boardheight= 640;
let boardwidth= 360;
let context;
let score=0;



//bird
let birdx= boardwidth/8;
let birdy=boardheight/2 ;
let birdwidth= 34;
let birdheight= 24;
let birdimg;

let bird={
    img: birdimg,
    x: birdx,
    y: birdy,   
    width: birdwidth,
    height: birdheight
};


//pipe
let pipearray= []; 
let pipewidth=64;
let pipeheight=512;
let pipex= boardwidth; //to place the pipe at the end of the board
let pipey= 0;
let toppipeimg;
let bottompipeimg;

//physics
let velocityx= -2; // for pipes
let velocityy= 0; // for birds - default to keep the it bird constant
let gravity= 0.4; // to make the bird fall down
let gameover = false;   

window.onload= function() { //when the page loads, run this function, onload krta hai
   board= document.getElementById("board");
   board.height= boardheight;
   board.width= boardwidth;
 context = board.getContext("2d");
//to see where bird would be
//    context.fillStyle= "green";
//    context.fillRect(birdx, birdy,birdwidth,birdheight);

   //to draw the bird
   birdimg= new Image();
    birdimg.src= "flappybird1.png";
    birdimg.onload= function() {   //when the image is loaded, drw the image
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }

    //to draw the pipe
    toppipeimg= new Image();
    toppipeimg.src= "./toppipe.png";

    bottompipeimg= new Image();
    bottompipeimg.src= "./bottompipe.png";
    
 

    //frame updation
    requestAnimationFrame(update);
    setInterval(placepipe,1500); //calls placepipe every 1.5 seconds 
    document.addEventListener("keydown", movebird);
        
   


}
function placepipe(){
    if (gameover==true){
        return;
    }


    let randompipey= pipey- pipeheight/4 -Math.random()*(pipeheight/2); //to place the pipe at random height
    let openingspace= boardheight/4;

    let toppipe={
        img: toppipeimg,
        x: pipex,
        y: randompipey,
        width: pipewidth,
        height: pipeheight,
        passed: false  //t check if bird passed
    }
    pipearray.push(toppipe); 

    let bottopipe={
        img:bottompipeimg,
        x: pipex,
        y: randompipey+pipeheight+openingspace,
        width: pipewidth,
        height: pipeheight,
        passed: false}
                
        pipearray.push(bottopipe);
    }


function update() { //this function will be called every frame
    requestAnimationFrame(update); //to call the update function again and again
    if (gameover==true){
        return;
    }
    context.clearRect(0, 0, board.width, board.height); //clear the board, brd is rectangle
     
    velocityy+= gravity; //to make the bird fall down
    //bird.y +=velocityy; // to move the bird go up 

    bird.y= Math.max(bird.y+velocityy, 0); //to make sure bird does not go out of the board

    //to redraw bird according to the new position of bird.y
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > boardheight){
        gameover=true; 
    }

    //update pipe
    for (let i=0; i<pipearray.length; i++){
        let pipe= pipearray[i]; 
        pipe.x += velocityx; //move the pipe to the left 
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); //draw the top pipe


if(!pipe.passed && bird.x > pipe.x + pipe.width){ //if bird has passed the pipe, then increase the score
    score+=0.5;
    pipe.passed= true; //to check if bird has passed the pipe
}

    if( detectcollision(bird, pipe)){
        gameover=true;
    }

    //score
context.fillStyle= "black";
context.font=("20px public pixels"); //font style
context.fillText(score, 10, 20);


    if (gameover) {
        context.font=("30px public pixels");
        context.fillText("GAME OVER", boardwidth/2-60 ,boardheight/2); //to display game over message
    }
    
  
}

}



function movebird(e){
    if (e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX"){
        velocityy=-6;  //means goiong up



    if(gameover){
        bird.y= birdy;
        pipearray= []; //to reset the pipe array
        score=0;
        gameover=false; //to reset the game
    }


    } 
}

function detectcollision(bird, pipe){
    return bird.x <pipe.x + pipe.width &&
    bird.x+ bird.width > pipe.x &&
    bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y;
}