import Walker from './js/Walker'
import { SVG } from '@svgdotjs/svg.js'
import { Noise } from 'noisejs'
import { scale } from './js/utils.js'
import './styles/index.scss'
import background1 from './images/pexels-milo-textures-2768398.jpg'
import background2 from './images/pexels-hoang-le-978462.jpg'

const nWalkers = 1000
const size = 400
const svg = SVG(".canvas");
let groups = [ {walkers: []} ];
let noise = new Noise(Math.random())
const drawBtn = document.getElementById('draw')
let animationFrame = null
// const closeBtn = document.getElementById('close')

const resetCanvas = () => {
    svg.clear()

    const fifth = size/5
    svg.line(0, fifth*3, size, fifth*3).stroke({ width: 4, color: '#FFF' })

    const triangleHeight = 0.5 * Math.sqrt(3) * fifth
    const triangle = `${fifth*2},${fifth*3} ${size/2},${(fifth*3) - triangleHeight} ${fifth*3},${fifth*3}`
    svg.polygon(triangle).fill('#000').stroke({ width: 4, color: '#FFF' }).front()

    // svg.rect(size, (fifth*3) - 2).fill('#000').backward()
    
    for(let x = -20; x < 30; x++) {
        let opacity = x < 6 ? scale(0, -20, 0.5, 0, x) : scale(30, 6, 0, 0.5, x)
        svg.line((size/2), size/2, (size/10) * x, size).stroke({ width: 1, color: '#FFF' }).opacity(opacity).back()
    }
    // svg.rect(size, (fifth*2)).fill('#000').move(0, fifth*3).back()
}

resetCanvas()

const createGroup = (x, y) => {
    let walkers = new Array(nWalkers).fill(null).map(i => new Walker(x, y, noise, size, (size/5) * 3))
    groups.push({walkers})
}

const draw = () => groups.map(({walkers}) => walkers.map(w => w.draw()))

// const animate = () => {
//     draw(i % 99 + 1)
//     animationFrame = requestAnimationFrame(animate)
// }

const handleDrawEvent = () => {
    cancelAnimationFrame(animationFrame)
    noise = new Noise(Math.random())
    resetCanvas()
    createGroup(size/2, ((size/5)*2.4) - (Math.random() * 10))
    draw()
}

drawBtn.addEventListener('click', handleDrawEvent)

// const params = new URLSearchParams(window.location.search);
// if(!params.get('hideClose')) {
//     closeBtn.classList.remove('hidden')
// }

document.querySelector('.background1__img').src = background1
document.querySelector('.background2__img').src = background2