const datatest = require("../data/datatest")

// Index
const index = (req, res) => {
    console.log("Sto inviando i dati");

    res.json({
        data: datatest
    })
};

// Show
const show = (req, res) => {
    const id = req.params.id
    const houseToFind = datatest.find((curHouse) => curHouse.id === parseInt(id))

    res.json({
        data: houseToFind
    })
};

// Store
const store = (req, res) => {

};

// Destroy
const destroy = (req, res) => {

};

module.exports = {
    index,
    show,
    store,
    destroy
};