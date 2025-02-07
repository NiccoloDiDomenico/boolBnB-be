const errorsHandler = (err, req, res, next) => {
    const resObj = {
        status: "Errore critico!",
        message: err.message,
    }
    if (process.env.environment === "development") {
        resObj.detail = err.stack;
    }
    return res.status(500).json(resObj);
}

module.exports = errorsHandler;