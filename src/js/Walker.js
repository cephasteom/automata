import { spline } from './utils.js'
import { SVG } from '@svgdotjs/svg.js'
class Walker {
    constructor(x, y, noise, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.noise = noise
        this.degree = 0.005
        this.velocityX = (Math.random() * 8 - 4)
        this.velocityY = (Math.random() * 8 - 4)
        this.opacity = Math.random() * 0.35
        this.colour = `rgba(255,255,255,${this.opacity})`
        this.svg = SVG(".canvas");
        this.points = [{x,y}]
        this.path = this.svg.path(this.getPathData(this.points)).stroke(this.colour).fill("none").backward()
        this.calculate()
    }
    isOut() {
        const { x, y, canvasHeight, canvasWidth } = this
        return (x < 0 || x > canvasWidth || y < 0 || y >= canvasHeight);
    }
    velocity() {
        const { noise, degree } = this
        this.velocityX += noise.simplex2(this.x * degree, this.y * degree);
        this.velocityY += noise.simplex2(this.y * degree, this.x * degree);
        return this
    }
    move() {
        const { velocityX, velocityY, canvasHeight, points } = this
        this.x += velocityX;
        this.y += velocityY;
        this.y = this.y > canvasHeight ? canvasHeight : this.y
        const {x, y} = this
        points.push({x,y})
        return this
    }
    calculate() {
        for(var x = 0; x < 100; x++) {
            !this.isOut() && this.velocity().move();
        }
        return this
    }
    getPathData(points) {
        return spline(points, 1, false);
    }
    draw() {
        const { path, points } = this
        path.plot(this.getPathData(points))
        return this
    }
}

export default Walker;