// Making a canvas
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
document.body.appendChild(canvas)

// Adjusting its style
canvas.height = Math.min(window.innerWidth, window.innerHeight)
canvas.width = canvas.height
canvas.style.backgroundColor = '#000'

// Extracting pixels
function extract(w=28, h=28) {
    // Resizing the image
    context.drawImage(canvas, 0, 0, w, h)
    const img = context.getImageData(0, 0, w, h).data
    context.clearRect(0, 0, 1.5 * w, 1.5 * h)

    // Converting RGBA -> Lightness + Normalizing
    const pixels = []
    for (let i = 0; i < img.length; i += 4) pixels.push(img[i] / 255.0)
    return pixels
}

// Drawing logic
let drawing

// Handle down event
function down(x, y) {
    drawing = true
    context.lineWidth = canvas.width / 20
    context.lineJoin = context.lineCap = 'round' 
    context.strokeStyle = '#fff'  
    context.shadowBlur = canvas.width / 200
    context.shadowColor = '#fff'
    context.moveTo(x, y)
}

// Handle move event
function move(x, y) {
    if (drawing) {
        context.lineTo(x, y)
        context.stroke()
    }
}

// Mouse events
canvas.onmousedown = e => down(e.clientX, e.clientY)
canvas.onmousemove = e => move(e.clientX, e.clientY)
canvas.onmouseup = _ => drawing = false

// Touch events
canvas.ontouchstart = e => down(e.touches[0].clientX, e.touches[0].clientY)
canvas.ontouchmove = e => move(e.touches[0].clientX, e.touches[0].clientY)
canvas.ontouchend = _ => drawing = false
