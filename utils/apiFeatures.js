class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.pagination = {};
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    search(fields = []) {
        if (this.queryString.search && fields.length) {
            const regex = new RegExp(this.queryString.search, "i");
            this.query = this.query.find({
                $or: fields.map((field) => ({ [field]: regex })),
            });
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            this.query = this.query.sort(
                this.queryString.sort.split(",").join(" ")
            );
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            this.query = this.query.select(
                this.queryString.fields.split(",").join(" ")
            );
        }
        return this;
    }

    paginate(totalDocs) {
        const page = parseInt(this.queryString.page, 10) || 1;
        const limit = parseInt(this.queryString.limit, 10) || 10;
        const skip = (page - 1) * limit;

        this.pagination = {
            page,
            limit,
            totalDocs,
            totalPages: Math.ceil(totalDocs / limit),
        };

        if (page > 1) {
            this.pagination.prevPage = page - 1;
        }
        if (page < this.pagination.totalPages) {
            this.pagination.nextPage = page + 1;
        }

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export default ApiFeatures;
