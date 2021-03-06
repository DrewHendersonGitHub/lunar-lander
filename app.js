import Phaser from 'phaser'

const config = {
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 80 },
      debug: false
    }
  }
}

const game = new Phaser.Game(config);

function preload() {
  this.load.image('mountain', 'assets/img/mountain.png');
  this.load.image('star', 'assets/img/star.png');
  this.load.image('background', 'assets/img/background.png');
  this.load.spritesheet('ship', 'assets/img/ship.png', {
    frameWidth: 32,
    frameHeight: 32
  })
  this.load.audio("game", "assets/sounds/game.mp3");
  this.load.audio("coin", "assets/sounds/coin.mp3")
}

function create() {
  this.music = this.sound.add("game");
  this.starSound = this.sound.add("coin");
  let mountains = this.physics.add.staticGroup();
  let background = mountains.create(0, 0, "background");
  let mountain = mountains.create(400, 500, "mountain");
  let musicConfig = {
    mute: false,
    volume: 0.1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0
  }
  this.music.play(musicConfig);
  let stars = this.physics.add.staticGroup();
  for (let i = 0; i < 8; i++) {
    stars.create(Math.floor(Math.random() * 700 + 50), Math.floor(Math.random() * 250 + 50), "star");
  }

  ship = this.physics.add.sprite(380, 380, "ship");
  ship.setCollideWorldBounds(true);
  this.physics.add.collider(ship, mountains);
  this.physics.add.collider(stars, mountains);

  cursors = this.input.keyboard.createCursorKeys();
  
  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 1 }),
    frameRate: 30,
    repeat: -1
  })

  this.anims.create({
    key: 'still',
    frames: [{ key: 'ship', frame: 1 }],
    frameRate: 20
  })

  let scoreText = this.add.text(16, 16, "Stars: 0", {
    fontSize: "32px",
    fill: "#ffffff",
  })
  
  let fuelText = this.add.text(16, 55, "Fuel: 0", {
    fontSize: "32px",
    fill: "#ffffff",
  })

  this.physics.add.overlap(
    ship,
    stars,
    (ship, star) => {
      this.starSound.play()
      star.disableBody(true, true)
      score += 1;
      scoreText.setText("Stars: " + score);
      if (score % 8 === 0) {
        for (let i = 0; i < 8; i++) {
          stars.create(Math.floor(Math.random() * 700 + 50), Math.floor(Math.random() * 250 + 50), "star");
        }
      }
    },
    null,
    this
  )

  this.physics.add.overlap(
    ship,
    background,
    (ship, star) => {
      fuelText.setText("Fuel: " + fuel);
    },
    null,
    this
  )
}

function update ()
{
  if (cursors.up.isDown && fuel > 0)
  {
    ship.anims.play('up', true);
    this.physics.velocityFromRotation(ship.rotation, 200, ship.body.acceleration);
    
    fuel--;
  }
  else
  {
    ship.anims.play('still');
    ship.setAcceleration(0);
  }

  if (cursors.left.isDown)
  {
    ship.setAngularVelocity(-300);
  }
  else if (cursors.right.isDown)
  {
    ship.setAngularVelocity(300);
  }
  else
  {
    ship.setAngularVelocity(0);
  }

  if (fuel === 0 && Math.abs(ship.body.velocity.x) === 0 && Math.abs(ship.body.velocity.y) === 0) {
    let gameoverText = this.add.text(150, 200, "Game Over: Score = " + score, {
      fontSize: "40px",
      fill: "#ffffff",
    })
    fuel = -1;
  }
}

let ship;

let cursors;

let fuel = 3000;
let score = 0;