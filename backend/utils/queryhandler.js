class QueryHandler {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const searchTerm = this.queryStr.searchTerm === 'null' ? {} :{
            name : {
                $regex : this.queryStr.searchTerm,
                $options: 'i'
            }
        };
        this.query = this.query.find({...searchTerm})
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };
        const removeFields = ["searchTerm","page","limit"];
        removeFields.forEach((key) => delete queryStrCopy[key]);
        //filter for price and ratings

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(itemPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = ( currentPage - 1 ) * itemPerPage;
        this.query = this.query.limit(itemPerPage).skip(skip);
        return this;
    }
}

module.exports = QueryHandler;