module.exports = (router) => {
    // LOAD HOME PAGE
    router.get('/', (req, res) => res.status(200).send("HELLO WORLD"));

};