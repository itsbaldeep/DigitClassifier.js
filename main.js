// Printing the prediction to the HTML
const p = document.createElement('p')
document.body.insertBefore(p, canvas)
p.style.fontSize = '2rem'
p.style.textAlign = 'center'
p.style.width = canvas.width + 'px'

// Function to draw a black background
setInterval(() => {
    context.beginPath()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.closePath()
}, 5000)

// Testing the model with user drawings
async function test(model) {
    const xs = extract()
    const guess = await model.predict(tf.tensor(xs, [1, 784])).data()
    const digit = guess.indexOf(Math.max(...guess))
    p.innerHTML = digit
    setTimeout(() => test(model), 500)
}

// Loading the saved model
fetch('model/dclf.weights.bin').then(data => data.blob())
    .then(data => new File([data], 'dclf.weights.bin'))
    .then(w => fetch('model/dclf.json').then(data => data.blob())
        .then(data => new File([data], 'dclf.json'))
        .then(j => tf.loadModel(tf.io.browserFiles([j, w])).then(test)))
