// error handler
const errorHandler = (err, req, res, next) => {
    if (err) {
        console.error(err.message);
        if (err.status === 404) {
            res.status({
                error: err.message,
            });
        } else if (err.status === 400) {
            res.status({
                error: err.message,
            });
        } else {
            res.status(500).send({
                error: err.message,
            });
        }
    } else {
        next();
    }
};

module.exports = {
    errorHandler
}