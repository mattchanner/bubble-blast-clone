import { BubbleType, nextType } from "./model/BubbleType";
import Rect from './model/Rect';
import Background from "./sprites/Background";
import DefinitionsProvider from "./model/DefinitionsProvider";
import Bubble from "./sprites/Bubble";
import Bullet from "./sprites/Bullet";
import { Direction } from "./model/Direction";
import Difficulty, { BubbleTypeRange } from "./model/Difficulty";
import { DifficultyLevel } from "./model/DifficultyLevel";
import GameStats from "./model/GameStats";
import Header from "./sprites/Header";
import { BoardGenerator } from "./model/BoardGenerator";

export default class Game {

    private static HeaderHeight = 50;

    private svg: SVGSVGElement | null = null;

    public gameArea: Rect = Rect.EMPTY;

    public boardArea: Rect = Rect.EMPTY;

    private background: Background | null = null;

    private provider: DefinitionsProvider | null = null;

    private bubbles = new Array<Bubble>();

    private bullets = new Array<Bullet>();

    private intervalHandle: number = -1;

    private difficulty: Difficulty = Game.gameSettings.easy;

    private difficultyLevel: DifficultyLevel = DifficultyLevel.Easy;

    private completeHandler: Function | undefined;

    private startHandler: Function | undefined;

    private gameStats : GameStats | undefined;

    private header: Header | null = null;

    private static gameSettings = {
        easy: 
            new Difficulty(0.6, 
                new BubbleTypeRange(0, 0.5),
                new BubbleTypeRange(0.5, 0.75),
                new BubbleTypeRange(0.75, 0.9),
                new BubbleTypeRange(0.9, 1)),
        medium: 
            new Difficulty(0.4, 
                new BubbleTypeRange(0, 0.3),
                new BubbleTypeRange(0.3, 0.6),
                new BubbleTypeRange(0.6, 0.90),
                new BubbleTypeRange(0.90, 1)),
        hard: 
            new Difficulty(0.3, 
                new BubbleTypeRange(0, 0.2),
                new BubbleTypeRange(0.2, 0.4),
                new BubbleTypeRange(0.4, 0.7),
                new BubbleTypeRange(0.7, 1))
    };

    constructor(private parent: HTMLElement, bounds: Rect) {    
        this.gameArea = bounds;
        this.boardArea = new Rect(
            bounds.getX(), 
            bounds.getY() + Game.HeaderHeight, 
            bounds.getWidth(), 
            bounds.getHeight() - Game.HeaderHeight);
    }

    getStats() {
        return this.gameStats;
    }

    addCompleteHandler(handler: Function) {
        this.completeHandler = handler;
    }

    addStartHandler(handler: Function) {
        this.startHandler = handler;
    }

    setDifficultyLevel(level: DifficultyLevel) {
        this.difficultyLevel = level;
        switch (level) {
            case DifficultyLevel.Easy:
                this.difficulty = Game.gameSettings.easy;
                break;
            case DifficultyLevel.Medium:
                this.difficulty = Game.gameSettings.medium;
                break;
            case DifficultyLevel.Hard:
                this.difficulty = Game.gameSettings.hard;
                break;
        }

        if (this.startHandler) {
            this.startHandler.call(this.startHandler);
        }
    }

    getDifficultyLevel() {
        return this.difficultyLevel;
    }
    
    start() {
        const panel = document.createElement("div");

        this.gameStats = new GameStats(this.getDifficultyLevel());

        this.parent.appendChild(panel);
        
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.width.baseVal.valueAsString = `600px`;
        this.svg.height.baseVal.valueAsString = "950px";

        panel.appendChild(this.svg);

        // this.background = new Background(this.svg);
        // this.background.setBounds(this.boardArea);

        this.provider = new DefinitionsProvider(document, this.svg);         

        this.header = new Header(this.svg, this.gameStats);
        this.header.setBounds(new Rect(this.gameArea.getX(), this.gameArea.getY(), this.gameArea.getWidth(), Game.HeaderHeight));

        this.gameStats.start();
        this.initGame();
    }

    stop() {
        window.clearInterval(this.intervalHandle);
        this.intervalHandle = -1;
    }

    private initGame() {

        if (this.svg == null) return;
        if (this.provider == null) return;

        if (this.intervalHandle >= 0) {
            window.clearInterval(this.intervalHandle);
        }

        const board = new BoardGenerator().generate(this.difficulty);

        let colourIndex = 0;    

        const headerHeight = this.header!.getBounds().getHeight();
        const boardHeight = this.boardArea.getHeight() - (headerHeight + 20);
        const cellHeight = boardHeight / board.rows;
        const cellWidth = this.boardArea.getWidth() / board.cols;

        for (let x = 0; x < board.cols; x++) {
        
            for (let y = 0; y < board.rows; y++) {

                const cell = board.get(x, y);
                if (cell === null) {
                    continue;
                }

                const bubble = new Bubble(this.svg, this.provider, cell, colourIndex);
                bubble.setBounds(new Rect(x * cellWidth, (y * cellHeight) + (headerHeight + 20), cellWidth, cellHeight));
                bubble.addClickHandler(() => {
                    if (!bubble.isDestroyed()) {
                        this.gameStats?.click();
                        this.fire(bubble);
                    }
                });

                this.bubbles.push(bubble);
                colourIndex++;
            }
        }

        this.intervalHandle = window.setInterval(this.gameLoop.bind(this), 1000 / 48);
    }

    private gameLoop() {
        try {
            this.moveBullets();
            this.animateAll();
            this.checkForGameEnd();
            this.refreshStats();
        }
        catch (e) {
            window.clearInterval(this.intervalHandle);
        }
    }

    refreshStats() {
        this.header?.refresh();
    }

    private checkForGameEnd() {
        if (this.bubbles.length === 0 && this.bullets.length === 0) {
            
            if (this.completeHandler) {
                this.completeHandler.call(this.completeHandler);
            }
            
            clearInterval(this.intervalHandle);
            this.intervalHandle = -1;
        }
    }

    private moveBullets() {

        const bulletsToRemove = new Array<Bullet>();
        const bulletsToAdd = new Array<Bullet>();

        for (let bullet of this.bullets) {
            bullet.moveBy(10);

            if (this.isOffScreen(bullet)) {
                bullet.destroy();
                bulletsToRemove.push(bullet);
            } else {
                const hit = this.hasHitBubble(bullet);

                if (hit !== null) {
                    const type = hit.getType();

                    bullet.destroy();
                    bulletsToRemove.push(bullet);

                    if (type === BubbleType.Red) {
                        bulletsToAdd.push(this.createBullet(hit.getRect(), Direction.North));
                        bulletsToAdd.push(this.createBullet(hit.getRect(), Direction.South));
                        bulletsToAdd.push(this.createBullet(hit.getRect(), Direction.East));
                        bulletsToAdd.push(this.createBullet(hit.getRect(), Direction.West));
                        this.gameStats?.combo();
                        hit.destroy();
                        this.bubbles = this.bubbles.filter(b => b !== hit);
                    } else {
                        hit.setType(nextType(hit.getType()));
                    }

                    bulletsToRemove.push(bullet);
                }
            }
        }

        for (let bullet of bulletsToRemove) {
            this.bullets = this.bullets.filter(b => b !== bullet);
        }

        this.bullets.push(...bulletsToAdd);
    }

    private animateAll() {
        for (let bubble of this.bubbles) {
            bubble.animate();
        }
    }

    private hasHitBubble(bullet: Bullet) {
        const bounds = bullet.getBulletRect();

        for (let bubble of this.bubbles) {
            const bubbleBounds = bubble.getRect();
            if (bubbleBounds.intersects(bounds) && !bubble.isDestroyed()) {
                return bubble;
            }
        }

        return null;
    }

    private isOffScreen(bullet: Bullet) {
        const bounds = bullet.getBulletRect();
        return !this.boardArea.intersects(bounds);
    }

    private fire(bubble: Bubble) {
        if (bubble.getType() === BubbleType.Red) {
            this.bubbles = this.bubbles.filter(b => b !== bubble);
            this.bullets.push(this.createBullet(bubble.getRect(), Direction.North));
            this.bullets.push(this.createBullet(bubble.getRect(), Direction.South));
            this.bullets.push(this.createBullet(bubble.getRect(), Direction.East));
            this.bullets.push(this.createBullet(bubble.getRect(), Direction.West));

            bubble.destroy();            
        } else {
            bubble.setType(nextType(bubble.getType()));
        }
    }

    private createBullet(initialBounds: Rect, direction: Direction) {
        const bullet = new Bullet(this.svg!, DefinitionsProvider.CSS_BODY_RED);

        bullet.setDirection(direction);
        bullet.setBounds(initialBounds);

        return bullet;
    }
}