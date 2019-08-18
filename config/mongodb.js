const mongo = require('mongoose')

mongo.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser : true })
    .catch( err => {
        const msg = 'Não foi possivel conectar ao MongoDB'
    
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')   
    
    })