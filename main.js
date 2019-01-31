// Take the model and test
async function test(model) {
    const guess = await model.predict(tf.ones([1, 784])).data()
    console.log(guess)
}

// Loading the saved model
fetch('model/dclf.weights.bin').then(data => data.blob())
    .then(data => new File([data], 'dclf.weights.bin'))
    .then(w => fetch('model/dclf.json').then(data => data.blob())
        .then(data => new File([data], 'dclf.json'))
        .then(j => tf.loadModel(tf.io.browserFiles([j, w])).then(test)))
