async function makeJSON(csv, limit, istest) {
    return await fetch(csv).then(data => data.text()).then(data => {
        // Divide by linebreaks to get rows
        data = data.split('\n')
        // Removing the first and last row as they don't contain any data
        data = data.slice(1, data.length - 1)
        // Reversing the comma delimiting and casting to int
        data = data.map(row => row.split(',').map(e => parseInt(e)))

        // Making the JSON Array
        const json = []
        if (!limit) limit = data.length
        for (let i = 0; i < limit; i++) {
            // There are no labels for test data
            if (istest) json.push({pixels: data[i]})
            // There are labels for train data
            else json.push({ label: data[i].shift(), pixels: data[i] })
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
