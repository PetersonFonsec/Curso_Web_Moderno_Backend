module.exports = app => {
    
    const { user } = app.api
    const { sigin, validateToken } = app.api.auth

    app.post('/sinup', user.save )
    app.post('/sinin', sigin )
    app.post('/validateToken', validateToken )

    app.route('/users')
        .all(app.config.auth.authenticate())
       .post(user.save)
       .get(user.get)

    app.route('/users/:id')
        .all(app.config.auth.authenticate())
        .put(user.save)
        .get(user.getById)
    
    const { category } = app.api
    
    app.route('/categories')
        .all(app.config.auth.authenticate())    
        .post(category.save)
        .get(category.get)

    app.route('/categories/tree')
        .all(app.config.auth.authenticate())    
        .get(category.getTree)

    app.route('/categories/:id')
        .all(app.config.auth.authenticate())    
        .get(category.getById)
        .put(category.save)
        .delete(category.remove)

    const { article } = app.api

    app.route('/articles')
        .all(app.config.auth.authenticate())
        .get(article.get)
        .post(article.save)

    app.route('/articles/:id')
        .all(app.config.auth.authenticate())
        .get(article.getById)
        .put(article.save)
        .delete(article.remove)

    app.route('/categories/:id/articles')
        .all(app.config.auth.authenticate())
        .get(app.api.articles.getByCategory)
}