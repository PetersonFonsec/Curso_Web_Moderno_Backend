const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    const sigin = async (req, res) => {
        
        const err = (msg, cod=500) => res.status(cod).send(msg)

        const { email, password } = req.body

        if( !email || !password ) return err('Informe usuário e senha!')

        const user = await app.db('users').where({ email }).first()
        
        if( !user ) return err('Usuário não encontrado', 400)

        const isMatch = bcrypt.compareSync(password, user.password)
        
        if(!isMatch) return err('Senha e ou Email inválidos', 400)

        const now = Math.floor (Date.now() / 1000)

        const { id, name, admin } = user

        const expired = days => now + ( 60 * 60 * ( days * 24) )

        const payload = {
            id,
            name,
            admin,
            ait: now,
            exp: expired(3)
        }

        res.json({
            ...payload,
            token: jwt.encode( payload, authSecret )
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null

        try{

            if(userData){
                const token = jwt.decode( userData.token, authSecret )

                if( new Date(token.exp * 1000) > new Date() ){
                    return res.send(true)
                }
            }
        
        }catch(e){}

        return res.send(false)
    }

    return { sigin, validateToken }
}