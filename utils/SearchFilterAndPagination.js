class SearchAndFilterClass {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    // Search Product
    search() {
        let keyword = {}
        const { productId, name } = this.queryString;
        // Search by product id with exact match
        if (productId) {
            keyword.productId = {
                $regex: productId,
                $options: "$",
            }
        }
        // Search by  product name with case insensitive match
        else if (name) {
            keyword.name = {
                $regex: name,
                $options: "i",
            }
        }
        this.query = this.query.find({ ...keyword });
        return this;
    }
    sorting(sortingOrder) {
        this.query = (sortingOrder === "-1" || sortingOrder === "1")
            ? this.query.sort({ "price": sortingOrder })
            : this.query = this.query.sort({})
        return this;
    }
    // Filter the products
    filter() {
        // Copy of the query string
        const queryCopy = { ...this.queryString }
        // Removing fields
        const removeFields = ['name', 'limit', 'page']
        removeFields.forEach(element => delete queryCopy[element])

        // Advance filtering
        let queryString = JSON.stringify(queryCopy)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryString))
        return this;
    }

    // product per page
    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1 // Default page 1 (or 10 product per page)
        const skip = resultPerPage * (currentPage - 1)
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this;
    }
}

module.exports = SearchAndFilterClass;