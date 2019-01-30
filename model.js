const model = tf.sequential()
// Hidden layer
model.add(tf.layers.dense({
    units: 16, 
    inputShape: [784], 
    activation: 'relu'
}))
// Output layer
model.add(tf.layers.dense({
    units: 10,
    activation: 'softmax'
}))

// Compiling the model
model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError'
})

// Fetching the dataset
fetch('data/json/train_full.json').then(data => data.json())
    .then(data => {
        // Getting inputs and labels from the training dataset
        const inputs = data.shift().map(img => img.map(pixel => pixel / 255))
        const labels = data.shift()
        const xs = tf.tensor(inputs, [inputs.length, 784])
        const ys = tf.tensor(labels, [labels.length, 10])

        // Training the model
        model.fit(xs, ys, {
            epochs: 10,
            callbacks: {
                // Printing the loss over time
                onEpochEnd: console.log,
                onTrainEnd: test
            }
        })
        // Uncomment to save the model
        // .then(() => model.save('downloads://dclf'))
    }).catch(console.error)

