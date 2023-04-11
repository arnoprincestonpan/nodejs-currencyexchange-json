// error handler
const errorHandler = (err, req, res, next) => {
    console.error(err.message)
    const status = err.status || 500
    res.status(status).send({
        error: err.message 
    })
};

module.exports = {
    errorHandler
}