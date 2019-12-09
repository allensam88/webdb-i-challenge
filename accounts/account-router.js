const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db
        .select('*')
        .from('accounts')
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error getting accounts' })
        })
});

router.get('/:id', (req, res) => {
    db
        .select('*')
        .from('accounts')
        .where({ id: req.params.id })
        .first()
        .then(account => {
            res.status(200).json(account)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error getting the account' })
        })
});

router.post('/', (req, res) => {
    const postData = req.body;
    db('accounts')
        .insert(postData, 'id')
        .then(ids => {
            const id = ids[0];
            return db('accounts')
                .select('id', 'name', 'budget')
                .where({ id })
                .then(post => {
                    res.status(201).json(post)
                });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error adding the account' })
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    db('accounts')
        .where({ id })
        .update(changes)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} record(s) updated` })
            } else {
                res.status(404).json({ message: 'record not found'})
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error updating the account' })
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db('accounts')
        .where({ id })
        .del()
        .then(count => {
            res.status(200).json({ message: `${count} record(s) deleted` })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'error deleting the account' })
        })
});

module.exports = router;