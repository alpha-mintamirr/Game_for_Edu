class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        this.gridSize = 20;
        this.snake = [{x: 15, y: 10}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.edenLetters = ['E', 'D', 'E', 'N'];
        this.collectedLetters = [];
        this.currentLetter = this.edenLetters[0];
        this.letterPosition = this.generateLetterPosition();

        this.audioManager = new AudioManager();
        this.audioManager.initialize();

        this.bindControls();
        this.gameLoop = this.gameLoop.bind(this);
        this.isGameOver = false;

        // Add mobile-specific setup
        document.body.classList.add('playing');
        window.addEventListener('resize', this.setupCanvas.bind(this));

        requestAnimationFrame(this.gameLoop);
    }

    setupCanvas() {
        // Make canvas responsive
        const maxWidth = Math.min(600, window.innerWidth - 20);
        const maxHeight = Math.min(400, window.innerHeight - 200);

        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;

        // Adjust grid size based on canvas size
        this.gridSize = Math.min(20, Math.floor(maxWidth / 30));
    }

    bindControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleDirection(e.key);
        });

        // Mobile touch controls
        const buttons = {
            'up-btn': 'ArrowUp',
            'down-btn': 'ArrowDown',
            'left-btn': 'ArrowLeft',
            'right-btn': 'ArrowRight'
        };

        Object.entries(buttons).forEach(([btnId, key]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                ['touchstart', 'mousedown'].forEach(eventType => {
                    btn.addEventListener(eventType, (e) => {
                        e.preventDefault();
                        this.handleDirection(key);
                    });
                });
            }
        });

        document.getElementById('restart-button').addEventListener('click', () => {
            this.resetGame();
        });

        // Prevent scrolling on mobile when touching game controls
        document.getElementById('mobile-controls').addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    handleDirection(key) {
        switch(key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };
    }

    generateLetterPosition() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };
    }

    update() {
        const head = {x: this.snake[0].x, y: this.snake[0].y};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collisions
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.audioManager.playCollectSound();
        } else {
            this.snake.pop();
        }

        // Check letter collision
        if (head.x === this.letterPosition.x && head.y === this.letterPosition.y) {
            this.collectedLetters.push(this.currentLetter);
            this.audioManager.playLetterSound();

            const nextLetterIndex = this.collectedLetters.length;
            if (nextLetterIndex < this.edenLetters.length) {
                this.currentLetter = this.edenLetters[nextLetterIndex];
                this.letterPosition = this.generateLetterPosition();
            }
        }

        document.getElementById('score').textContent = this.score;
        document.getElementById('collected-letters').textContent = this.collectedLetters.join('');
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(
            (this.food.x * this.gridSize) + this.gridSize/2,
            (this.food.y * this.gridSize) + this.gridSize/2,
            this.gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Draw current letter
        if (this.collectedLetters.length < this.edenLetters.length) {
            this.ctx.fillStyle = '#f1c40f';
            this.ctx.font = `${this.gridSize}px Dancing Script`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                this.currentLetter,
                (this.letterPosition.x * this.gridSize) + this.gridSize/2,
                (this.letterPosition.y * this.gridSize) + this.gridSize/2 + this.gridSize/3
            );
        }
    }

    gameLoop() {
        if (!this.isGameOver) {
            this.update();
            this.draw();
            setTimeout(() => requestAnimationFrame(this.gameLoop), 1000/10);
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.audioManager.playGameOverSound();
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').classList.remove('hidden');
        document.body.classList.remove('playing');
    }

    resetGame() {
        this.setupCanvas();
        this.snake = [{x: 15, y: 10}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.collectedLetters = [];
        this.currentLetter = this.edenLetters[0];
        this.letterPosition = this.generateLetterPosition();
        this.isGameOver = false;
        document.getElementById('game-over').classList.add('hidden');
        document.body.classList.add('playing');
        requestAnimationFrame(this.gameLoop);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
});