const pageNotFound = (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: "Pagina non trovata"
    })
}

module.exports = pageNotFound;