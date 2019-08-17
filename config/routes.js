module.exports = app => {
    const { user } = app.api

    app.route('/users')
       .post(user.save)
       .get(user.get)

    app.route('/users/:id')
        .put(user.save)
        .get(user.getById)
    
    const { category } = app.api
    
    app.route('/categories')
        .post(category.save)
        .get(category.get)

    app.route('/categories/tree')
        .get(category.getTree)

    app.route('/categories/:id')
         .get(category.getById)
         .put(category.save)
         .delete(category.remove)

    const { article } = app.api

    app.route('/articles')
        .get(article.get)
        .post(article.save)

    app.route('/articles/:id')
        .get(article.getById)
        .put(article.save)
        .delete(article.remove)
        
}