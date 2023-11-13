//board

let board;
let boardWidth = 900;
let boardHeight = 500;
let context;

//yoshi

let yoshiWidth = 77;
let yoshiHeight = 97;
let yoshiX = 50;
let yoshiY = boardHeight - yoshiHeight;
let yoshiImg;

let yoshi = {
    x : yoshiX,
    y : yoshiY,
    width : yoshiWidth,
    height : yoshiHeight
}

//FLOR COMELONA MALANDRISTICA

    let floresarray = [];

    let flor1width = 50;
    let flor2width = 150;
    let flor3width = 250;
    
    let florheight = 81;
    let florX = 900;
    let florY = boardHeight - florheight

    let flor1img;
    let flor2img;
    let flor3img;
    ///

//FISICAS
    let velocityX = -8;
    let velocityY = 0;
    let gravity = 0.3;

    let initialYoshiVelocityX = -8;
    let initialYoshiVelocityY = 0;

    let gameover = false;
    let pause = false;

    let btnRecargar = document.getElementById("btnRecargar");

    let isGeneratingFlowers = true;
    let score = 0;

////////////////

    window.onload = function(){
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d") //para dibujar en el canvas

    //ubicar el yoshi , flores y demas

    yoshiImg = new Image()
    yoshiImg.src = "./img/yoshineta.png"
    yoshiImg.onload = function () {
        context.drawImage(yoshiImg, yoshi.x, yoshi.y , yoshi.width, yoshi.height)
    }

    velocityX = initialYoshiVelocityX;
    velocityY = initialYoshiVelocityY;

    flor1img = new Image()
    flor1img.src = "./img/flor1-test.png";

    flor2img = new Image()
    flor2img.src = "./img/flor2.png";

    flor3img = new Image()
    flor3img.src = "./img/flor3.png";

    requestAnimationFrame (update)
    setInterval(ponerflores, 1000)//llamar a la funcion cada 1 segundo
    document.addEventListener ("keydown" , MuevaYoshiMueva)
    }


    ////////


    function update() {
        
        requestAnimationFrame(update);

        if (pause) {
            return;
        }
        
        if (gameover) {
            return;
        }
        
        context.clearRect(0, 0, board.width, board.height); // Limpiar el lienzo  

        //yoshi
        velocityY += gravity;
        yoshi.y = Math.min(yoshi.y + velocityY, yoshiY); // Aplica gravedad a yoshi
        context.drawImage(yoshiImg, yoshi.x, yoshi.y, yoshi.width, yoshi.height); // Dibuja a yoshi
        
        //flores
        for (let i = 0; i < floresarray.length; i++) {
            let flores = floresarray[i];
            flores.x += velocityX;
            context.drawImage(flores.img, flores.x, flores.y, flores.width, flores.height);
            
//DETECTAR COLISION 
            if (detectocolision (yoshi , flores)){
                gameover = true;
                yoshiImg = new Image();
                yoshiImg.src = "./img/ded.jpg";
                

    
                dibujarGameOver();
                
            
                yoshiImg.onload = function () {
                    context.drawImage (yoshiImg, yoshi.x, yoshi.y, yoshi.width, yoshi.height);
                }
            }
        } 
    
        context.fillStyle = "black";
        context.font = "20px courier";
        score++;
        context.fillText(score, 50, 20);
    }

    function MuevaYoshiMueva(e){
        if (gameover){
            return;
        }

        if ((e.code == "Space" || e.code == "ArrowUp") && yoshi.y == yoshiY){
            //verifica que este en el suelo para saltar
            velocityY = -10;
        }


    }

     /////////////////////////////////////////

    function ponerflores () {
        //pone las flores , du uh

        if (gameover){
            return;
        }

        if (gameover || !isGeneratingFlowers) {
            return;
        }
        let flores = {
            img : null,
            x : florX,
            y : florY,
            width : null,
            height : florheight
        }

        let chanceflores = Math.random (); //genera un numero random para ver que flor generar

        if (chanceflores > .95) //10% chance de flor3
         {
            flores.img = flor3img;
            flores.width = flor3width;
            floresarray.push(flores)
        }
        else if (chanceflores > .75) //30% chance de flor2
        {
           flores.img = flor2img;
           flores.width = flor2width;
           floresarray.push(flores)
       }
       else if (chanceflores > .45) //50% chance de flor1
       {
          flores.img = flor1img;
          flores.width = flor1width;
          floresarray.push(flores)
      }

    if (floresarray.length >5){
        floresarray.shift(); //elimina el primer elemento del array asi no crece de forma constante
    }

    }

    // Función para dibujar el cartel de Game Over
    function dibujarGameOver() {
    context.fillStyle = "white";
    context.font = "bold 40px pacifico";
    context.textAlign = "center";

    context.fillText("Game Over", board.width / 2, board.height / 1.7);
    context.fillText("SCORE: " + score , board.width / 2, board.height / 1.5);
}

    ////////////////////////

    function togglePause() {
        pause = !pause;

        if (pause) {
            isGeneratingFlowers = false; // Detener la generación de flores durante la pausa
        } else {
            isGeneratingFlowers = true; // Continuar la generación de flores al reanudar el juego

            velocityX = initialYoshiVelocityX;
            velocityY = initialYoshiVelocityY;

            requestAnimationFrame(update);
            setInterval(ponerflores, 1000);
        }
    }


        ////////////////////////

        function recargarPagina() {
            location.reload();
        }

        ////////////////////////



    function detectocolision(a, b) {
        return a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
               a.x + a.width > b.x && //a's top right corner passes b's top left corner
               a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
               a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
    }

        //////////////////////////