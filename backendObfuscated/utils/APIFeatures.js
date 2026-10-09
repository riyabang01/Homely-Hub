class APIFeatures {
    constructor(query, queryString) {
        this.query = query;           
        this.queryString = queryString; 
    }

    filter() {
        let filterObj = {};
        let queryCopy = { ...this.queryString };

        const minPrice = queryCopy.minPrice !== undefined && queryCopy.minPrice !== "" ? Number(queryCopy.minPrice) : undefined;
        const maxPrice = queryCopy.maxPrice !== undefined && queryCopy.maxPrice !== "" ? Number(queryCopy.maxPrice) : undefined;

        if (minPrice !== undefined && maxPrice !== undefined) {
            if (typeof queryCopy.maxPrice === 'string' && queryCopy.maxPrice.includes('>')) {
                filterObj['price'] = { '$gte': minPrice };
            } else {
                filterObj['price'] = { 
                    '$gte': minPrice, 
                    '$lte': maxPrice 
                };
            }
        }

        if (queryCopy.propertyType) {
            let typesArray = queryCopy.propertyType.split(',').map(item => item.trim());
            filterObj['propertyType'] = { '$in': typesArray };
        }

        if (queryCopy.roomType && queryCopy.roomType !== 'AnyType' && queryCopy.roomType !== 'Anytype') {
            filterObj['roomType'] = queryCopy.roomType;
        }

        if (queryCopy.amenities) {
            let amenitiesArray = Array.isArray(queryCopy.amenities) 
                ? queryCopy.amenities 
                : queryCopy.amenities.split(',').map(item => item.trim());
                
            filterObj['amenities.name'] = { '$all': amenitiesArray };
        }

        this.query = this.query.find(filterObj);
        return this;
    }

    search() {
        let searchObj = {};
        let queryCopy = { ...this.queryString };

        if (queryCopy.city && queryCopy.city.trim() !== '') {
            const searchRegex = new RegExp(queryCopy.city.trim(), 'i');
            searchObj['$or'] = [
                { 'address.city': searchRegex },
                { 'address.state': searchRegex },
                { 'address.area': searchRegex }
            ];
        }

        if (queryCopy.guests) {
            const guestCount = parseInt(queryCopy.guests, 10);
            if (!isNaN(guestCount)) {
                searchObj['maximumGuest'] = { '$gte': guestCount };
            }
        }

        if (queryCopy.dateIn && queryCopy.dateOut) {
            const reqCheckIn = new Date(queryCopy.dateIn);
            const reqCheckOut = new Date(queryCopy.dateOut);

            if (!isNaN(reqCheckIn.getTime()) && !isNaN(reqCheckOut.getTime())) {
                searchObj['$and'] = searchObj['$and'] || [];
                searchObj['$and'].push({
                    'currentBookings': {
                        '$not': {
                            '$elemMatch': {
                                '$or': [
                                    { 'fromDate': { '$lte': reqCheckIn }, 'toDate': { '$gte': reqCheckOut } },
                                    { 'fromDate': { '$lte': reqCheckIn }, 'toDate': { '$gt': reqCheckIn } },
                                    { 'fromDate': { '$lt': reqCheckOut }, 'toDate': { '$gte': reqCheckOut } }
                                ]
                            }
                        }
                    }
                });
            }
        }

        this.query = this.query.find(searchObj);
        return this;
    }

    paginate() {
        let page = this.queryString.page * 1 || 1;
        let limit = this.queryString.limit * 1 || 12; 
        let skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
