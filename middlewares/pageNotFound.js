const pageNotFound = (req, res, next) => {
    res.status(404).json({
        status: "Fail",
        message: "Pagina non trovata"
    })
}

module.exports = pageNotFound;