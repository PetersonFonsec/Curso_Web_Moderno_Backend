module.exports = middleware => {
    return (req, res, next ) => {
        
        const { admin } = req.user
        
        admin 
            ? middleware( req, res, next ) 
            : res.status(401).send('Usuário não é administrador.')

    }
}