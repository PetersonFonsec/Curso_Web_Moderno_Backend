const admin = require('./admin')

module.exports = app => {
    
    const { user } = app.api
    const { sigin, validateToken } = app.api.auth
    const { authenticate } = app.config.passport

    app.post('/sinup', user.save )
    app.post('/sinin', sigin )
    app.post('/validateToken', validateToken )

    app.route('/users')
        .all(authenticate())
       .post(admin(user.save) )
       .get(admin(user.get) )

    app.route('/users/:id')
        .all(authenticate())
        .put( admin(user.save) )
        .get(user.getById)
    
    const { category } = app.api
    
    app.route('/categories')
        .all(authenticate())    
        .post( admin(category.save) )
        .get(category.get)

    app.route('/categories/tree')
        .all(authenticate())    
        .get(category.getTree)

    app.route('/categories/:id')
        .all(authenticate())    
        .get(category.getById)
        .put( admin(category.save) )
        .delete( admin(category.remove) )

    const { article } = app.api

    app.route('/articles')
        .all( authenticate() )
        .get(admin(article.get) )
        .post( admin( article.save ) )

    app.route('/articles/:id')
        .all( authenticate() )
        .get(article.getById)
        .put(admin(article.save) )
        .delete( admin( article.remove ) )

    app.route('/categories/:id/articles')
        .all( authenticate() )
        .get( article.getByCategory )
}