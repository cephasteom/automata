import { spline } from './utils.js'
import { SVG } from '@svgdotjs/svg.js'
class Walker {
    constructor(x, y, noise) {
        this.px = x;
        this.py = y;
        this.x = x;
        this.y = y;
        this.canvasHeight = 1000
        this.canvasWidth = 1000
        this.noise = noise
        this.velocityX = (Math.random() * 2 - 2)
        this.velocityY = (Math.random() * 2 - 2)
        this.opacity = Math.random() * 0.1
        this.colour = `rgba(255,255,255,${this.opacity})`
        this.svg = SVG(".canvas");
        this.points = []
        this.draw();
    }
    isOut() {
        const { x, y, canvasHeight, canvasWidth } = this
        return (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight);
        return false
    }
    velocity () {
        const { noise } = this
        let degree = 0.0025
        this.velocityX += noise.simplex2(this.x * degree, this.y * degree);
        this.velocityY += noise.simplex2(this.y * degree, this.x * degree);
        return this
    }
    move() {
        const { velocityX, velocityY } = this
        this.x += velocityX;
        this.y += velocityY;
        return this
    }
    draw() {
        const { x, y, px, py, width, height, points, svg } = this

        const pathData = spline([{x: px, y: py}, {x, y}], 1, false);
        svg.path(pathData).stroke("#111").fill("none");
        this.px = x
        this.py = y
        return this
    }
}

export default Walker;