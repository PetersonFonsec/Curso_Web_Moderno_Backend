module.exports = app => {
    app.route('/users')
       .post(app.api.user.save)
       .get(app.api.user.get)

    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/categories')
        .post(app.api.category.save)
        .get(app.api.category.get)

     app.route('/categories/:id')
         .delete(app.api.category.remove)
         .get(app.api.category.getById)
}