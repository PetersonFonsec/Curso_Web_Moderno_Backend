function existsOrError(value, msg){
    if(!value) throw msg
    if(Array.isArray(value) && value.length === 0 ) throw msg
    if(typeof value === 'string' && !value.trim() ) throw msg
} 

function notExistsOrError(value, msg){
    try{
        existsOrError(value, msg)
    }catch(error){
        return 
    }

    throw msg
}

function EqualOrError(valueA, valueB, msg){
    if(valueA !== valueB) throw msg
}

module.exports = { existsOrError, notExistsOrError, EqualOrError }