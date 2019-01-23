async function makeJSON(csv, limit, istest) {
    return await fetch(csv).then(data => data.text()).then(data => {
        // Divide by linebreaks to get rows
        data = data.split('\n')
        // Removing the first and last row as they don't contain any data
        data = data.slice(1, data.length - 1)
        // Reversing the comma delimiting and casting to int
        data = data.map(row => row.split(',').map(e => parseInt(e)))

        // Data will be stored in json variable
        const json = []
        // Limit of storage
        if (!limit) limit = data.length

        // In test data, there are just pixel values
        if (istest) {
            for (let i = 0; i < limit; i++) json.push(data[i])
        }

        // In train data, there are pixels and labels
        else {
            json.push([], [])
            for (let i = 0; i < limit; i++) {
                // Labels is a one-hot encoded array
                const labels = Array(10).fill(0)
                labels[data[i].shift()] = 1

                // Pushing pixels and labels
                json[0].push(data[i])
                json[1].push(labels)
            }
        }
        return JSON.stringify(json)
    }).catch(console.error)
}

function saveJSON(args, output) {
    makeJSON(...args).then(json => {
        // Making a button to save the JSON when clicked
        const button = document.createElement('a')
        const link = new Blob([json], {type: 'application/json'})
        button.href = URL.createObjectURL(link)
        button.download = output
        button.innerHTML = `Click to save ${button.download} <hr>`
        document.body.appendChild(button)
    }).catch(console.error)
}

// Some constants for static path
const traindata = 'data/csv/train.csv'
const testdata = 'data/csv/test.csv'

// Put files, rows and output file name below to save it

// Saving a 1000 rows of traindata and 200 of testdata
// saveJSON([traindata, 1000], 'train.json')
// saveJSON([testdata, 200, true], 'test.json')

// Saving full traindata and full testdata
// saveJSON([traindata], 'train.json')
// saveJSON([testdata, false, true], 'test.json')
