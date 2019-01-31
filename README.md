# DigitClassifier.js
This is a simple Digit Recognizer made in ***JavaScript*** using ***TensorFlow.js and Kaggle***

### Dataset Used
**[Kaggle - Digit-Recognizer](https://www.kaggle.com/c/digit-recognizer/data)** is used for training and testing.
```
1. train.csv (42000 images x 1 label + 784 pixels)
2. test.csv (28000 images x 784 pixels)
```

### Library Used
**[Tensorflow.js](https://js.tensorflow.org/)** is used for making the Neural Network model itself. The layers API is used for the purpose. A simple multilayer perceptron is used. **Convolutional Neural Network is not used**, although I know it would have been better.

## Data Preparation
Data in **csv** is converted to **json** using JavaScript itself.

Check the source code **dataprep.js** for the conversion steps
```javascript
// Saving a 1000 rows of traindata and 200 of testdata
saveJSON([traindata, 1000], 'train.json')
saveJSON([testdata, 200, true], 'test.json')

// Saving full traindata and full testdata
saveJSON([traindata], 'train.json')
saveJSON([testdata, false, true], 'test.json')
```

## Making the Model
A **sequential** model from TensorFlow.js Layers API is used.
```javascript
const model = tf.sequential()
```
Containing **two layers**, i.e., one hidden and one output
```javascript
model.add(tf.layers.dense({
  units: 16, 
  inputShape: [784], 
  activation: 'relu'
}))
model.add(tf.layers.dense({
  units: 10,
  activation: 'softmax'
}))
```
Compiled with **adam optimizer** and **mean squared error** loss function
```javascript
model.compile({
  optimizer: 'adam',
  loss: 'meanSquaredError'
})
```

## Training the model
First the data is **normalized** and **converted to tensors**
```javascript
const inputs = data.shift().map(img => img.map(pixel => pixel / 255))
const labels = data.shift()
const xs = tf.tensor(inputs, [inputs.length, 784])
const ys = tf.tensor(labels, [labels.length, 10])
```

Here is the code for **model.fit()**
```javascript
model.fit(xs, ys, {
    epochs: 10,
    callbacks: {
        // Printing the loss over time
        onEpochEnd: console.log,
        onTrainEnd: test
    }
})
```

Then the model is saved as **dclf.weights.bin** and **dclf.json**
```javascript
model.save('downloads://dclf')
```

Loaded again using **tf.loadModel()**, check **main.js** for full code
```javascript
tf.loadModel(tf.io.browserFiles([j, w]))
```

## Testing the model
Images from test data are first **drawn to the HTML5 canvas**
```javascript
const img = new ImageData(size, size)
for (let i = 0; i < img.data.length; i += 4) {
  // ... Put pixels from test data to img
}
context.putImageData(img, pos.x, pos.y)
```
While the images are being drawn, **labels predicted by the model are drawn as text**
```javascript
context.strokeText(labels[index++], pos.x, pos.y + size)
```

## What's more
Users can also **draw digits to the canvas** and get predictions

The digit from canvas is extracted with this function
```javascript
function extract(w=28, h=28)
```

The canvas is first **resized to 28x28**
```javascript
context.drawImage(canvas, 0, 0, w, h)
const img = context.getImageData(0, 0, w, h).data
context.clearRect(0, 0, w, h)
```

Now, the pixels are **mapped to its brightness values** and **normalized accordingly**
```javascript
const pixels = []
for (let i = 0; i < img.length; i += 4) pixels.push(img[i] / 255.0)
return pixels
```

Now prediction can be made easily with this:
```javascript
const xs = extract()
const guess = await model.predict(tf.tensor(xs, [1, 784])).data()
const digit = guess.indexOf(Math.max(...guess))
```


