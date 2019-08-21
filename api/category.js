module.exports =  app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res)=> {
        const category = { ...req.body }

        if( req.params.id )  category.id = req.params.id
        
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
            const { id } = req.params
            
            const subCategory = await app.db('categories').where({ parantId: id })
            
            notExistsOrError(subCategory, 'Categoria possui subcategorias')

            const article = await app.db('articles').where({ categoryId: id })

            notExistsOrError(article, 'Categoria possui artigos')

            const rowDeleted = await app.db('categories').where({ id }).del()

            existsOrError(rowDeleted, 'Categoria não encontrada')
            
            res.status(200).send()

        }catch(msg){
            console.log(msg)
            res.status(400).send(msg)
        }
    }

    const withPath = categories => {
        const getParent = ( categories, parentId ) => {
            const patents = categories.filter( parent => parent.id === parentId )
            return patents.length > 0 ? patents[0] : null
        }

        const categoriesWithPath = categories.map( category => {
            let path = category.name
            let parent = getParent( categories, category.parantId )
            
            while(parent){
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parantId)
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
            .catch( console.log )  
    }

    const getById = ( req, res ) => {
        app.db('categories')
           .where({ id: req.params.id })
           .first()
           .then(category => res.json(category) )
           .catch( err => res.status(500).send({err}) )  
    }

    const toFree = ( categories, tree )=> {
        
        if( !tree ) tree = categories.filter( c => !c.parantId )
        
        tree = tree.map(parentNode => { 

            const isChild = node => node.parantId === parentNode.id
            
            parentNode.children = toFree(categories, categories.filter( isChild ) )
            
            return parentNode
        })

        return tree
    }
    
    const getTree = ( req, res ) => {

        const Composer = ( f, x ) => y => f( x(y) )
        
        const Response = categories => res.json( Composer( toFree, withPath )(categories) )
        
        app.db('categories')
            .then( Response )
            .catch( err => res.status(500).send({err}) )
    }
    
    return { save, get, getById, remove, getTree }
}