import Walker from './js/Walker'
import { SVG, Line } from '@svgdotjs/svg.js'
import { Noise } from 'noisejs'
import { spline } from './js/utils.js'
import './styles/index.scss'

const nWalkers = 250
const size = 500
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
    const fifth = size/5
    let line = svg.line(0, fifth*3, size, fifth*3).stroke({ width: 4, color: '#FFF' })

    const triangleHeight = (1/2) * Math.sqrt(3) * fifth
    let triangle = svg.polygon(`${fifth*2},${fifth*3} ${size/2},${(fifth*3) - triangleHeight} ${fifth*3},${fifth*3}`).fill('#000').stroke({ width: 4, color: '#FFF' }).front()

    let rect = svg.rect(size, (fifth*2)).fill('#000').move(0, fifth*3)
}

setupCanvas()

const createGroup = (x, y) => {
    let walkers = new Array(nWalkers).fill(null).map(i => new Walker(x, y, noise, size))
    groups.push({walkers})
}

const animate = () => {
    animationFrame = window.requestAnimationFrame(animate)
    let now = Date.now();
    let elapsed = now - then;
    elapsed > fpsInterval && (then = now - (elapsed % fpsInterval)) && draw();
}

const draw = () => {
    groups = groups
        .map(({walkers}) => {
            walkers = walkers
                .map(walker => {
                    if(!walker.isOut()) walker.velocity().move().draw()
                    return walker;
                })
            return { walkers }
        })
}

const handleClickEvent = (e) => {
    let y = ((size/5)*2.4) - (Math.random() * 10)
    createGroup(size/2,y)
    if(!isAnimating) {
        animationFrame = window.requestAnimationFrame(animate)
        isAnimating = true
    }
}

document.querySelector('.canvas').addEventListener('click', handleClickEvent)

clearBtn.addEventListener('click', e => {
    window.cancelAnimationFrame(animationFrame);
    groups = []
    isAnimating = false
    noise = new Noise(Math.random())
    svg.clear()
    setupCanvas()
})

const params = new URLSearchParams(window.location.search);
if(!params.get('hideClose')) {
    closeBtn.classList.remove('hidden')
}
