module.exports = {
    categoryWithChildre : `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c
                WHERE "parantId" = subcategories.id
        )
        SELECT id FROM subcategories
    `
}