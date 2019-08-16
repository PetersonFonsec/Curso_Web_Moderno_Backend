module.exports =  app => {
    const { existsOrError, notExistsOrError, EqualOrError } = app.api.validation

    const save = (req, res)=> {
        const category = { ...req.body }

        if( req.params.body )  category.id = req.params.id

        try{
            existsOrError( category.name, 'Nome não informado' )
        }catch(msg){
            return res.status(400).send(msg)
        }
        
        if( category.id ){
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then( _ => res.status(200).send() )
                .catch( err => res.status(500).send({err}) )
        }else{
            app.db('categories')
                .insert(category)
                .then( _ => res.status(200).send() )
                .catch( err => res.status(500).send({err}) )                
        }
    }

    const remove = async (req, res) => {
        try {
            const subCategory = await app.db('categories').where({ parentId: req.body.id})

            notExistsOrError(subCategory, 'Categoria possui subcategorias')

            const article = await app.db('categories').where({ categoryId: req.body.id})

            notExistsOrError(article, 'Categoria possui artigos')

            const rowDeleted = await app.db('categories').where({ id: req.body.id}).del()

            ExistsOrError(rowDeleted, 'Categoria não encontrada')
                                            
        }catch(msg){
            res.status(400).send(msg)
        }
    }

    const withPath = categories => {
        const getParent = ( categories, parentId ) => {
            const patents = categories.filter( parent => parent.id === parentId )
            return patents.length > 0 ? parent[0] : null
        }

        const categoriesWithPath = categories.map( category => {
            let path = category.name
            let parent = getParent( categories, category.parentId )
            
            while(parent){
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }

        })

        categoriesWithPath.sort( (a,b) =>{
            if(a.path < b.path) return -1
            if(b.path < a.path) return 1 

            return 0
        })

        return categoriesWithPath
    }

    const get = ( req, res ) => {
        app.db('categories').then( categories => res.json( withPath(categories) ) )
            .catch( err => res.status(500).send({err}) )  
    }

    const getById = ( req, res ) => {
        app.db('categories')
           .where({ id: req.params.id })
           .first()
           .then(category => res.json(category) )
           .catch( err => res.status(500).send({err}) )  
    }

    return { save, get, getById, remove }
}