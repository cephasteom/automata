import { spline } from './utils.js'
import { SVG } from '@svgdotjs/svg.js'
class Walker {
    constructor(x, y, noise) {
        this.x = x;
        this.y = y;
        this.canvasHeight = 200
        this.canvasWidth = 200
        this.noise = noise
        this.velocityX = (Math.random() * 4 - 2)
        this.velocityY = (Math.random() * 4 - 2)
        this.opacity = Math.random() * 0.35
        this.colour = `rgba(255,255,255,${this.opacity})`
        this.svg = SVG(".canvas");
        this.points = [{x,y}]
        this.draw();
    }
    isOut() {
        const { x, y, canvasHeight, canvasWidth } = this
        return (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight);
    }
    velocity () {
        const { noise } = this
        let degree = 0.01
        this.velocityX += noise.simplex2(this.x * degree, this.y * degree);
        this.velocityY += noise.simplex2(this.y * degree, this.x * degree);
        return this
    }
    move() {
        const { velocityX, velocityY, points } = this
        this.x += velocityX;
        this.y += velocityY;
        const {x, y} = this
        points.push({x,y})
        return this
    }
    draw() {
        const { points, svg, colour } = this
        const pathData = spline(points, 1, false);
        svg.path(pathData).stroke(colour).fill("none");
        return this
    }
}

export default Walker;