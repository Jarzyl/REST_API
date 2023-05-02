const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')

// Getting all

router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({ message: err.message }) // error with server/database
    }
})
// Getting One

router.get('/:id', getSubscriber, (req, res) => {
    // res.send(res.subscriber.name) // get the name for example
    res.json(res.subscriber)
})

// Creating One

router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newSubscriber = await subscriber.save() // wyśle zapis do bazy danych
        res.status(201).json(newSubscriber) // successfully created an object
    } catch (err) {
        res.status(400).json( { message: err.message }) // something wrong with user input!
    }
})

// Updating One

router.patch('/:id', getSubscriber, async (req, res) => {
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err) {
        res.status(400).json( { message: err.message })
    }
})

// Deleting One

router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.deleteOne()
        res.json({ message: 'Deleted Subscriber' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getSubscriber(req, res, next) {
    let subscriber;
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber === null) {
            return res.status(404).json({ message: 'Cannot find subscriber' }) // you could not find something
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.subscriber = subscriber;
    next() // will alow us to move on to the next piece of middleware or the actual request itself
}

module.exports = router;

// Other option for delete

// async function getSubscriber(req, res, next) {
//     let subscriber;
//     try {
//         subscriber = await Subscriber.findOne({ _id: req.params.id }).exec();
//         if (subscriber === null) {
//             return res.status(404).json({ message: 'Cannot find subscriber' });
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }

//     res.subscriber = subscriber;
//     next();
// }