// Game configuration
const config = {
    type: Phaser.WEBGL,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#0f172a',
    canvasStyle: 'display: block; width: 100%; height: 100%',
    autoFocus: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    }
};

// Game variables
let game;
let player;
let cursors;
let stars;
let enemies;
let score = 0;
let health = 100;
let gameOver = false;
let enemySpawnTimer;

// Start button event listener
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    game = new Phaser.Game(config);
});

// Restart button event listener
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    score = 0;
    health = 100;
    gameOver = false;
    game = new Phaser.Game(config);
});

// Phaser scene functions
function preload() {
    // Load assets from Pexels
    this.load.image('background', 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg');
    this.load.image('player', 'https://images.pexels.com/photos/1631677/pexels-photo-1631677.png');
    this.load.image('enemy', 'https://images.pexels.com/photos/73873/star-clusters-rosette-nebula-star-galaxies-73873.jpeg');
    this.load.image('star', 'https://images.pexels.com/photos/110854/pexels-photo-110854.jpeg');
}

function create() {
    // Add background
    this.add.image(400, 300, 'background').setScale(1.5);

    // Create player
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.1);
    player.setCollideWorldBounds(true);

    // Create stars
    stars = this.physics.add.group();
    for (let i = 0; i < 100; i++) {
        stars.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'star')
            .setScale(0.02)
            .setAlpha(0.5);
    }

    // Create enemies group
    enemies = this.physics.add.group();

    // Set up controls
    cursors = this.input.keyboard.createCursorKeys();

    // Enemy spawn timer
    enemySpawnTimer = this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // Collision detection
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
}

function update() {
    if (gameOver) return;

    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
    }

    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('health').textContent = health;
}

function spawnEnemy() {
    if (gameOver) return;

    const enemy = enemies.create(
        Phaser.Math.Between(50, 750),
        0,
        'enemy'
    ).setScale(0.05);

    enemy.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(50, 150)
    );

    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
}

function hitEnemy() {
    health -= 10;
    if (health <= 0) {
        health = 0;
        endGame();
    }
}

function endGame() {
    gameOver = true;
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('end-screen').classList.remove('hidden');
    game.destroy(true);
}