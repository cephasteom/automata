import Walker from './js/Walker'
import { SVG } from '@svgdotjs/svg.js'
import { Noise } from 'noisejs'
import { spline } from './js/utils.js'
import './styles/index.scss'

const nWalkers = 100
const svg = SVG(".canvas");
let groups = [];
let isAnimating = false;
let noise = new Noise(Math.random())
let animationFrame = null;
const clearBtn = document.getElementById('clear')
const closeBtn = document.getElementById('close')

const createGroup = (x, y) => {
    let walkers = new Array(nWalkers).fill(null).map(i => new Walker(x, y, noise))
    groups.push({walkers})
}

const draw = () => {
    svg.clear()
    groups = groups
        .map(({walkers}) => {
            if(walkers.every(walker => walker.isOut())) {
                window.cancelAnimationFrame(animationFrame);
            }
            walkers = walkers
                .map(walker => {
                    if(!walker.isOut()) walker.velocity().move()
                    walker.draw();
                    return walker;
                })
                // .filter(walker => !!walker)
            return { walkers }
        })
        .filter(group => !!group);
    animationFrame = window.requestAnimationFrame(draw)
}

const handleClickEvent = (e) => {
    // createGroup(e.x, e.y)
    createGroup(500,500)
    if(!isAnimating) {
        animationFrame = window.requestAnimationFrame(draw)
        isAnimating = true
    }
}

document.querySelector('.canvas').addEventListener('click', handleClickEvent)

clearBtn.addEventListener('click', e => {
    window.cancelAnimationFrame(animationFrame);
    groups = []
    isAnimating = false
    noise = new Noise(Math.random())
})

const params = new URLSearchParams(window.location.search);
if(!params.get('hideClose')) {
    closeBtn.classList.remove('hidden')
}
