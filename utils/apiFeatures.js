class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.query = mongooseQuery;
        this.queryString = queryString;
    }

    /* 🔍 FILTER */
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Advanced filtering (gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    /* 🔍 SEARCH */
    search(searchFields = []) {
        if (this.queryString.keyword && searchFields.length) {
            const regex = new RegExp(this.queryString.keyword, "i");

            this.query = this.query.find({
                $or: searchFields.map((field) => ({
                    [field]: regex,
                })),
            });
        }
        return this;
    }

    /* 🔃 SORT */
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    /* 🎯 FIELDS LIMITING */
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    /* 📄 PAGINATION */
    paginate(totalDocs) {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        this.pagination = {
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            totalDocs,
        };

        return this;
    }
}

export default ApiFeatures;
