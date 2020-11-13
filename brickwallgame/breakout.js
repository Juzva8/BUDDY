var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");

var keysDown = {}; // Holds key which is pressed
window.addEventListener("keydown",function(e){ keysDown[e.keyCode] = true; }); // If a key is pressed it becomes key down value
window.addEventListener("keyup",function(e){ delete keysDown[e.keyCode]; }); // If a key is released the variable is reset

var BricksArray = []; // Array which will hold all bricks that are on screen.
var Lives = 3; // Number of times the player can lose the ball before reaching the game over screen
var Score = 0; // Holds the players score
var BricksDestroyed = 0; // Counts the number of bricks that are destroyed
var Level = 1; // Hold current level
var Gameover = false; // Becomes true when lives reach 0
var BallFree = false; // If true player has pressed space bar and released the ball

var paddle = { // Paddle that the player plays at
  x: 350,
  y: 350,
  width: canvas.width / 8,
  height: canvas.width / 50,
  xSpeed: 5
}

var ball = { // The ball which will bounce of bricks
  x: paddle.x,
  y: paddle.y - 50,
  xSpeed: 250,
  ySpeed: 250,
  radius: 10
}

function Brick(x, y, width, height, colour) // Called to create bricks
{
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.colour = colour;
}

function BrickList() // Adds bricks to Bricks Array
{
  var TempBrick; // Holds the temporary brick until it is pushed into the array of bricks
    for (i = 0; i < 8; i++)
    {
      TempBrick = new Brick(i*90 + 50 , 40, canvas.width / 12, canvas.height / 20, "red"); // Creates a spaced out line of red bricks
      BricksArray.push(TempBrick); // Pushes each brick onto array
    }

    for (j = 0; j < 8; j++)
    {
      TempBrick = new Brick(j*90 + 50 , 80, canvas.width / 12, canvas.height / 20, "orange"); // Creates a spaced out line of orange bricks
      BricksArray.push(TempBrick); // Pushes each brick onto array
    }

    for (k = 0; k < 8; k++)
    {
      TempBrick = new Brick(k*90 + 50 , 120, canvas.width / 12, canvas.height / 20, "yellow"); // Creates a spaced out line of yellow bricks
      BricksArray.push(TempBrick); // Pushes each brick onto array
    }
}

function render() 
{
  if (Gameover == false) // As long as player has lives...
  {

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears canvas

    // If the ball needs to be released
    if (BallFree == false) // Ball is being 'held' by paddle
    {
      // Writes release ball message to screen
      ctx.font="30px Arial";

      InstructionsText = "Press Space to Release Ball";
      ctx.fillStyle = "white";
      ctx.fillText(InstructionsText, canvas.width / 2 - 170, canvas.height / 2);
    }
    //Draws red paddle for player to play as
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.width,paddle.height);
    ctx.fillStyle = "red";
    ctx.fill();

    // Draws the ball
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    //Draws the bricks and fills them in as their colour
    for (j = 0; j < BricksArray.length; j++)
    {
      ctx.beginPath();
      ctx.rect(BricksArray[j].x, BricksArray[j].y, BricksArray[j].width, BricksArray[j].height);
      ctx.fillStyle = BricksArray[j].colour;
      ctx.fill();
    }

    // Heads up display
    ctx.font="20px Arial"; // Astablishes font

    //Draws heads up Display
    HUDLives = "Lives: " + Lives;
    ctx.fillStyle = "white";
    ctx.fillText(HUDLives, 25, 25); // Puts Lives on the left side of screen

    HUDScore = "Score : " + Score;
    ctx.fillStyle = "white";
    ctx.fillText(HUDScore, canvas.width / 2 - 50, 25); // Centers Score

    HUDLevel = "Level : " + Level;
    ctx.fillStyle = "white";
    ctx.fillText(HUDLevel, canvas.width - 150, 25); // Puts Level indicator on the top/right side of the screen

    
  }
  else // If game is lost
  {
    // Show game overscreen
    ctx.font="50px Arial";

    GameoverText = "Game Over";
    RestartText = "Press Enter to Restart";
    ctx.fillStyle = "white";
    ctx.fillText(GameoverText, canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText(RestartText, canvas.width / 2 - 230, canvas.height / 2 + 50);

    if(13 in keysDown) // If enter is pressed on game over screen
    {
      restart(); // Resets game
    }
  }
}

function update(elapsed) 
{
  // Movement of paddle
  if(37 in keysDown)  // Left arrow is pressed
  {
    if (paddle.x < 0) // If paddle is about to leave the screen
    {
      paddle.x = paddle.x; // Don't let it move
    }
    else
    {
      paddle.x -= paddle.xSpeed; // Moves paddle left
    }
  }

  if(39 in keysDown) // Right arrow is pressed
  {
    if (paddle.x >= 700) // If paddle is about to leave the screen
    {
      paddle.x = paddle.x; // Don't let it move
    }
    else
    {
      paddle.x += paddle.xSpeed; // Move right
    }
  }

  // Update the ball position according to the elapsed time
  if (BallFree == true)
  {
    ball.y += ball.ySpeed * elapsed;
    ball.x += ball.xSpeed * elapsed;

    // Bounce the ball of all edges
    if(ball.x - ball.radius <= 0) // Left
    {
      ball.xSpeed *= -1;
      ball.x = ball.radius;
    }

    if(ball.x + ball.radius >= canvas.width) // Right
    {
      ball.xSpeed *= -1;
      ball.x = canvas.width - ball.radius;
    }

    if(ball.y - ball.radius <= 0) // Top
    {
      ball.ySpeed *= -1;
      ball.y = ball.radius;
    }

    if(ball.y + ball.radius >= canvas.height) // Bottom
    {
      if (Lives > 0) // Player still has lives
      {
        Lives --; // Decrements lives and resets ball in a way so it will hit the paddle
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - 25;
        BallFree = false;
      }
      else
      {
        Gameover = true; // Show game over screen
      }
    }
  }
  else
  {
    ball.y = paddle.y - 25;
    ball.x = paddle.x + paddle.width/2;

    if(32 in keysDown)
    {
      BallFree = true;
    }
  }
  // On collision with paddle
  if(ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width
  && ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height) 
  {
    ball.ySpeed *= -1;
    ball.y = paddle.y - ball.radius;
  }
  // Collsions with different sides of each brick
  for (var j = 0; j < BricksArray.length; j++)
  {
    // Ball collides with top of bricks
    if(((ball.y + ball.radius > BricksArray[j].y) && (ball.y + ball.radius < BricksArray[j].y + BricksArray[j].height)) && (ball.x - ball.radius >= BricksArray[j].x && ball.x + ball.radius <= BricksArray[j].x + BricksArray[j].width))
    {
      ball.ySpeed *= -1;
      BricksArray.splice(j,1);
      BricksDestroyed++;
      if(BricksDestroyed == 24) // If all bricks on screen destroyed
      {
        AllBricksDestroyed();
      }
    }
    // Ball collides with bottom of bricks
    else if(((ball.y - ball.radius < BricksArray[j].y + BricksArray[j].height) &&(ball.y - ball.radius > BricksArray[j].y)) && (ball.x + ball.radius >= BricksArray[j].x && ball.x + ball.radius <= BricksArray[j].x + BricksArray[j].width))
    {
      ball.ySpeed *= -1; // Reverse y axis
      BricksArray.splice(j,1); // Remove brick from array which will in turn stop drawing it
      Score += Level * 100; // Increment score by the current level multiplied by 100
      BricksDestroyed++; // Increment number of bricks destroyed
      if(BricksDestroyed == 24) // If all bricks on screen destroyed
      {
        AllBricksDestroyed();
      }
    }

    // Ball collides with left side of bricks
    else if(((ball.x + ball.radius > BricksArray[j].x)&&(ball.x + ball.radius < BricksArray[j].x + BricksArray[j].width )) && (ball.y + ball.radius >= BricksArray[j].y && ball.y - ball.radius <= BricksArray[j].y + BricksArray[j].height))
    {
      ball.xSpeed *= -1; // Reverse y axis
      BricksArray.splice(j,1); // Remove brick from array which will in turn stop drawing it
      Score += Level * 100; // Increment score by the current level multiplied by 100
      BricksDestroyed++; // Increment number of bricks destroyed
      if(BricksDestroyed == 24) // If all bricks on screen destroyed
      {
        AllBricksDestroyed();
      }
    }

    // Ball collides with right side of bricks
    else if(((ball.x - ball.radius < BricksArray[j].x + BricksArray[j].width) && (ball.x - ball.radius > BricksArray[j].x)) && (ball.y + ball.radius >= BricksArray[j].y && ball.y - ball.radius <= BricksArray[j].y + BricksArray[j].height))
    {
      ball.xSpeed *= -1; // Reverse y axis
      BricksArray.splice(j,1); // Remove brick from array which will in turn stop drawing it
      Score += Level * 100; // Increment score by the current level multiplied by 100
      BricksDestroyed++; // Increment number of bricks destroyed
      if(BricksDestroyed == 24) // If all bricks on screen destroyed
      {
        AllBricksDestroyed();
      }
    }
  }
}

function restart() // Resets all games data to original default allowing for new game
{
  Lives = 3;
  Score = 0;
  BricksDestroyed = 0;
  Level = 1;
  Gameover = false;

  BricksArray = []; // Clears array
  BrickList(); // Refills array with new bricks

  paddle.x = 350
  paddle.y = 350;
  paddle.width = canvas.width / 8,
  paddle.height = canvas.width / 50,
  paddle.xSpeed = 5;

  ball.x = paddle.x;
  ball.y = paddle.y - 50;
  ball.xSpeed = 250;
  ball.ySpeed = 250;
  BallFree = false;
}

function AllBricksDestroyed() // Ran when all the blocks on screen are destroyed
{
  BricksDestroyed = 0; // Reset counter
  Level++; // Increase level
  ball.y = paddle.y - 25;
  ball.x = paddle.x + paddle.width/2;
  BallFree = false; // Wait for the player to release the ball
  BrickList(); // Creates a new set of bricks
  paddle.xSpeed +=2; // Increases paddle speed
  ball.xSpeed += 10; // Increase ball's x Speed
  ball.ySpeed += 10; // Increase ball's y speed
}

var previous;
function run(timestamp) 
{
  if (!previous) previous = timestamp;          //start with no elapsed time
  var elapsed = (timestamp - previous) / 1000;  //work out the elapsed time
  update(elapsed);                              //update the game with the elapsed time
  render();                                     //render the scene
  previous = timestamp;                         //set the (globally defined) previous timestamp ready for next time
  window.requestAnimationFrame(run);            //ask browser to call this function again, when it's ready
}
BrickList(); // Refills array with bricks

// Trigger the game loop
window.requestAnimationFrame(run); 