var runner;
var bg, bgImg;
var gs;
var score, highScore, time;
var deathSound, died;
var touches;
var obstaclesGroup, obstaclesGroupRed;

function preload() {
    bgImg = loadImage("background.png")
    deathSound = loadSound("deathSound.mp3")
    highScoreSound = loadSound("highScoreSound.mp3")
    jumpSound = loadSound("jumpSound.mp3")
    restartButton = loadImage("restartButton.png")
    runnerImg = loadImage("runnerImg.png")
}

function setup() {
    gs = 1;
    score = 0;
    highScore = 0;
    time = 0;
    obstaclesGroup = new Group();
    obstaclesGroupRed = new Group();

    createCanvas(800, 800);
    background(200);

    bg = createSprite(400,200)
    bg.addImage(bgImg)
    bg.velocityY = 2;

    died = 0;

    runner = createSprite(400, 400, 50, 50)
    runner.addImage(runnerImg)
    runner.scale = 0.065
    runner.setCollider("circle", 50, 30)

    button = createSprite(400, 400)
    button.addImage(restartButton)
    button.scale = 0.1;
    button.visible = false;

    edges = createEdgeSprites();
}

function draw() {
    background("#3e6fb3");
    if (gs == 1) {
        died = 0;
        runner.bounceOff(edges[0]);
        runner.bounceOff(edges[1]);
        runner.bounceOff(edges[2]);
        if (runner.bounceOff(obstaclesGroup)) {
            score += 3;
        }
        deathSound.stop();
        highScoreSound.stop();
        soundPlayed = 0;
        if (bg.y > height - 300) {
            bg.y -= 200;
        }
        runner.velocityY += 0.6 + (time / 2500);
        time += 1;
        if (keyWentDown("space") || keyWentDown(UP_ARROW)) {
            runner.velocityY = -15;
            score -= 1;
            jumpSound.play()
        }
        if (keyDown(LEFT_ARROW)) {
            runner.velocityX -= 0.8;
            score -= 0.1;
        }
        if (keyDown(RIGHT_ARROW)) {
            runner.velocityX += 0.8;
            score -= 0.1;
        }
        if (frameCount % 20 == 0) {
            randomNum = Math.round(random(1,22));
            if (randomNum <= 10) {
                obstacle = createSprite(random(15, 785), -30, 30, 30)
                obstaclesGroup.add(obstacle)
                obstacle.velocityY = 2 + (time / 350)
                obstacle.lifetime = 500;
            }

            else if (randomNum <= 13) {
                obstacle = createSprite(random(15, 785), -30, 30, 30)
                obstacle.shapeColor = "blue";
                obstaclesGroup.add(obstacle)
                obstacle.velocityY = (2 + (time / 350)) * 1.6;
                obstacle.lifetime = 500;
            }

            else if (randomNum <= 16) {
                obstacle = createSprite(random(25, 775), -50, 50, 50)
                obstacle.shapeColor = "black";
                obstaclesGroup.add(obstacle)
                obstacle.velocityY = 2 + (time / 350);
                obstacle.lifetime = 500;
            }
            else if (randomNum <= 18) {
                obstacle = createSprite(random(25, 775), -50, 50, 50)
                obstacle.shapeColor = "#DDDDDD";
                obstaclesGroup.add(obstacle)
                obstacle.velocityY = (2 + (time / 350)) * 1.6;
                obstacle.lifetime = 500;
            }
            else if (randomNum <= 20) {
                obstacle = createSprite(random(15, 785), -30, 30, 30)
                obstacle.shapeColor = "red";
                obstaclesGroupRed.add(obstacle)
                obstacle.velocityY = 2 + (time / 350);
                obstacle.lifetime = 500;
            }
            else {
                obstacle = createSprite(400, -200, 200, 200)
                obstacle.shapeColor = "yellow";
                obstaclesGroup.add(obstacle)
                obstacle.velocityY = 2 + (time / 350);
                obstacle.lifetime = 500;
            }
        }

    }

    if ((runner.isTouching(edges[3]) || runner.isTouching(obstaclesGroupRed)) && died == 0) {
        gs = 0;
        runner.velocityY = 0;
        obstaclesGroup.setVelocityYEach(0);
        obstaclesGroupRed.setVelocityYEach(0);
        obstaclesGroup.setLifetimeEach(-1);
        obstaclesGroupRed.setLifetimeEach(-1);
        obstaclesGroup.setVelocityXEach(1);
        obstaclesGroupRed.setVelocityXEach(1);
        runner.velocityX = 0;
        bg.velocityY = 0;
    }

    if (gs == 0) {

        runner.velocityY += 0.03;

        button.visible = true;

        if (mousePressedOver(button)) {
            reset();
        }

        if (died == 0 && score <= highScore) {
            died = 1;
            deathSound.play();
        }
        else if (died == 0) {
            died = 1;
            highScore = score;
            highScoreSound.play();
        }
    }

    drawSprites();

    textSize(20);
    fill("white");
    text("Grey: Normal obstacle.\nBlue: Fast obstacle.\nBlack: Big obstacle.\nWhite: Big and fast obstacle.\nRed: Killer obstacle. Don't touch.\nYellow: Huge obstacle.\n\nYellow obstacles always\nspawn in the middle.", 500, 50)
    text("Score: " + Math.round(score) + "\nHighscore: " + Math.round(highScore), 50, 50)

}

function reset() {
    obstaclesGroup.destroyEach();
    obstaclesGroupRed.destroyEach();
    runner.velocityY = 0;
    time = 0;
    score = 0;
    runner.x = 400;
    runner.y = 400;
    button.visible = false;
    bg.y = 200;
    bg.velocityY = 2;
    gs = 1;

}