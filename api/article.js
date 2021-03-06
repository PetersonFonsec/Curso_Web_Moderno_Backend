const query = require('./query')

module.exports = app => {
    const { existsOrError } = app.api.validation
    
    const save = (req, res) => {
        const article = { ...req.body }
        
        try{
            const { name, description, categoryId, userId, content} = article

            existsOrError(name, 'Nome não informado')
            existsOrError(description, 'Descrição não informado')
            existsOrError(categoryId, 'Categoria não informada não informado')
            existsOrError(userId, 'Autor não informada não informado')
            existsOrError(content, 'Conteudo não informada não informado')

        }catch(msg){
            return res.status(400).send(msg)
        }

        if( article.id ){
            app.db('articles')
                .where({ id: article.id })
                .first()
                .then( _ => res.status(200).send() )
                .catch( err => res.status(500).send({err}) )   
        }else{
            app.db('articles')
                .insert(article)
                .then( _ => res.status(200).send() )
                .catch( err => res.status(500).send({err}) )   
        }
    }
    
    const remove = (req, res) => {
        const { id } = req.params
        
        try{
            app.db('articles')
                .where({ id })
                .del()
                .then( rowsDroped => res.status(200).send() )
                .catch( err => res.status(500).send({err}) )   
        }catch(err){
            return res.status(500).send( { err } ) 
        }
    }
    
    const limit = 5
    
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

        await app.db('articles')
                .select('id', 'name', 'description')
                .limit(limit)
                .offset(page * limit - limit )
                .then( articles => res.json({ data: articles, count, limit }) )
                .catch( err => res.status(500).send({err}) )
    }

    const getById = (req, res) => {

        try{
            app.db('articles')
                .where({ id: req.params.id })
                .first()
                .then( article => {
                    article.content = article.content.toString()
                    return res.json(article)
                })
                .catch( err => res.status(500).send(err) )

        }catch(err){
            return res.status(500).send({err})
        }
    }

    const getByCategory = async (req, res) => {
        
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw( query.categoryWithChildre, categoryId )
                
        const ids = categories.rows.map( c => c.id )
        
        app.db({ a:'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit)
            .offset( page * limit - limit)
            .whereRaw('?? = ??', [ 'u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then( article => res.json(article))
            .catch( err => res.status(500).send(err))
    }

    return  { save, remove, get, getById, getByCategory }
}
