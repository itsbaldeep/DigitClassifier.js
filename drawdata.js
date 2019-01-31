// Making canvas 
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

// Size of the images
const size = 28

// Adding the canvas to the HTML
document.body.appendChild(canvas)

// Array holding labels
const labels = []

async function drawpixels(data, model) {

    // Adjusting canvas size to fit all images
    canvas.width = window.innerWidth - window.innerWidth % size
    canvas.height = size * Math.round(data.length / canvas.width * size)

    // Keeping track of where to put the image
    const pos = {x: 0, y: 0}

    // Predicting the label
    const data_n = data.map(img => img.map(pixel => pixel / 255))
    const guess = await model.predict(tf.tensor(data_n, [data_n.length, 784])).data()
    
    // One Hot encoding and pushing it to labels array
    labels.splice(0, labels.length)
    let index = 0
    while (index < guess.length) {
        const subarray = guess.subarray(index, index + 10)
        const label = subarray.indexOf(Math.max(...subarray))
        labels.push(label)
        index += 10
    }
    index = 0

    // Looping through each image
    for (let cur of data) {

        // Drawing the pixels
        const img = new ImageData(size, size)
        for (let i = 0; i < img.data.length; i += 4) {
            let pix = cur.shift()
            img.data[i + 0] = 255 - pix
            img.data[i + 1] = 255 - pix
            img.data[i + 2] = 255 - pix
            img.data[i + 3] = 255
        }
        context.putImageData(img, pos.x, pos.y)

        // Drawing the label
        context.font = '14px Arial'
        context.strokeStyle = 'red'
        context.strokeText(labels[index++], pos.x, pos.y + size)

        // Adjusting the position of next image
        pos.x += size
        if (pos.x > canvas.width) {
            pos.x = 0
            pos.y += size
        }
    }
}

function test(model) {
    fetch('test.json')
        .then(data => data.json())
        .then(data => drawpixels(data, model))
        .catch(console.error)
}
