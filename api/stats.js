module.exports = app => {
    const Stats = app.mongodb.model('Stats', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    const get = async (req, res) =>{
        const stats = await Stats.findOne({}, {}, { sort: { 'createdAt': -1 } } )

        return res.json(stats)
    }

    return { Stats, get }
}