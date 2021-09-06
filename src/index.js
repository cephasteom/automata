import Walker from './js/Walker'
import { SVG } from '@svgdotjs/svg.js'
import { Noise } from 'noisejs'
import { spline } from './js/utils.js'
import './styles/index.scss'

const nWalkers = 500
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

const createGroup = (x, y) => {
    let walkers = new Array(nWalkers).fill(null).map(i => new Walker(x, y, noise))
    groups.push({walkers})
}

const animate = () => {
    groups.every(walkers => walkers.walkers.every(walker => walker.isOut())) ? null :
        animationFrame = window.requestAnimationFrame(animate)
    let now = Date.now();
    let elapsed = now - then;
    elapsed > fpsInterval && (then = now - (elapsed % fpsInterval)) && draw();
}

const draw = () => {
    svg.clear()
    groups = groups
        .map(({walkers}) => {
            walkers = walkers
                .map(walker => {
                    if(!walker.isOut()) walker.velocity().move()
                    walker.draw();
                    return walker;
                })
            return { walkers }
        })
        .filter(group => !!group);
}

const handleClickEvent = (e) => {
    // createGroup(e.x, e.y)
    createGroup(200,200)
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
})

const params = new URLSearchParams(window.location.search);
if(!params.get('hideClose')) {
    closeBtn.classList.remove('hidden')
}
