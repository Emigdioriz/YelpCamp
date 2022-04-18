module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}
// função para substituir o try e catch na funções async, no caso de error handling