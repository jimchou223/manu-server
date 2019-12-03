const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const express = require('express')
const app = express()

app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const port = process.env.PORT || 3000



const url = 'mongodb+srv://jimchou223:Jj669824@cluster0-l4bto.mongodb.net/mydb?retryWrites=true&w=majority'
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(url, mongooseOptions)
    .then(() => {
        console.log('database connected')
    })
    .catch((err) => {
        console.log(`Error: ${err}`)
    })


app.get('/findall', (req, res) => {
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("test");
            dbo.collection("dish").find().toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                res.send(result)
                db.close();
            })
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})

app.get('/findbyset/:set', (req, res) => {
    let filterParams = req.params
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("test");
            dbo.collection("dish").find(filterParams).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                res.send(result)
                db.close();
            })
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})

app.post('/search', (req, res) => {
    // console.log(req.body)
    let filter = req.body
    // finalFilters = []
    let set = filter.set
    const order = { set: 1, index: 1 }
    // filter.filters.forEach(el => {
    //     finalFilters.push({ ingredients: el })
    // })

    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("test");
            if (set == '') {
                dbo.collection("dish").find({}).sort(order).toArray(function (err, result) {
                    if (err) throw err;
                    res.send(result)
                    db.close();
                })
            }
            // } else {
            //     dbo.collection("dish").find({ set: set }).sort(order).toArray(function (err, result) {
            //         if (err) throw err;
            //         res.send(result)
            //         db.close();
            //     })
            // }

        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })

})
app.post('/post', (req, res) => {
    let dishObj = {
        set: req.body.set,
        name: req.body.name,
        index: req.body.index,
        ingredients: req.body.ingredients
    }
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("test");
            dbo.collection("dish").insertOne(dishObj, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})

app.listen(port, () => console.log(`listening to port ${port}`))