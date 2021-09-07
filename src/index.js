import Walker from './js/Walker'
import { SVG } from '@svgdotjs/svg.js'
import { Noise } from 'noisejs'
import { scale } from './js/utils.js'
import './styles/index.scss'

const nWalkers = 100
const size = 400
const svg = SVG(".canvas");
let fps = 25 
let fpsInterval = 1000 / fps
let then = Date.now()
let groups = [ {walkers: []} ];
let isAnimating = false;
let noise = new Noise(Math.random())
let animationFrame = null;
const clearBtn = document.getElementById('clear')
const closeBtn = document.getElementById('close')

const setupCanvas = () => {
    svg.clear()

    const fifth = size/5
    svg.line(0, fifth*3, size, fifth*3).stroke({ width: 4, color: '#FFF' })

    const triangleHeight = 0.5 * Math.sqrt(3) * fifth
    const triangle = `${fifth*2},${fifth*3} ${size/2},${(fifth*3) - triangleHeight} ${fifth*3},${fifth*3}`
    svg.polygon(triangle).fill('#000').stroke({ width: 4, color: '#FFF' }).front()

    svg.rect(size, (fifth*3) - 2).fill('#000').backward()
    
    for(let x = -20; x < 30; x++) {
        let opacity = x < 6 ? scale(0, -20, 0.5, 0, x) : scale(30, 6, 0, 0.5, x)
        svg.line((size/2), size/2, (size/10) * x, size).stroke({ width: 1, color: '#FFF' }).opacity(opacity).back()
    }
    svg.rect(size, (fifth*2)).fill('#000').move(0, fifth*3).back()
}

setupCanvas()

const createGroup = (x, y) => {
    let walkers = new Array(nWalkers).fill(null).map(i => new Walker(x, y, noise, size, (size/5) * 3))
    groups.push({walkers})
}

const animate = () => {
    let now = Date.now();
    let elapsed = now - then;
    elapsed > fpsInterval && (then = now - (elapsed % fpsInterval)) && draw();
    animationFrame = window.requestAnimationFrame(animate)
}

const draw = () => {
    // groups.map(({walkers}) => ({
    //     walkers: walkers.map(walker => walker.isOut() ? 
    //         walker :
    //         walker.velocity().move().draw() 
    //     )
    // }))
    groups.map(({walkers}) => walkers.map(w => w.draw()))
}

const handleClickEvent = (e) => {
    createGroup(size/2, ((size/5)*2.4) - (Math.random() * 10))
    draw()
    // !isAnimating 
    //     && (animationFrame = window.requestAnimationFrame(animate))
    //     && (isAnimating = true);
}

document.querySelector('.canvas').addEventListener('click', handleClickEvent)

clearBtn.addEventListener('click', e => {
    window.cancelAnimationFrame(animationFrame);
    groups = []
    isAnimating = false
    noise = new Noise(Math.random())
    setupCanvas()
})

// const params = new URLSearchParams(window.location.search);
// if(!params.get('hideClose')) {
//     closeBtn.classList.remove('hidden')
// }
