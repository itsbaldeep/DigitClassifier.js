const model = tf.sequential()
// Hidden layer
model.add(tf.layers.dense({
    units: 16, 
    inputShape: [784], 
    activation: 'softmax'
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
fetch('data/json/train.json').then(data => data.json())
    .then(data => {
        // Getting inputs and labels from the training dataset
        const inputs = data.shift()
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
    }).catch(console.error)

