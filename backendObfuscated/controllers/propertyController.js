const Property = require('../Models/propertyModel');
const APIFeatures = require('../utils/APIFeatures');


exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({
                status: 'fail',
                message: 'No property found with that ID reference.'
            });
        }
        
        
        res.status(200).json({
            status: 'success',
            property
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.createProperty = async (req, res) => {
    try {
        const propertyData = {
            ...req.body,
            userId: req.user.id
        };
        
        const newProperty = await Property.create(propertyData);

        res.status(201).json({
            status: 'success',
            property: newProperty
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.getProperties = async (req, res) => {
    try {
      
        const features = new APIFeatures(Property.find(), req.query)
            .filter()
            .search()
            .paginate();

        const properties = await features.query;
        
        
        const totalPropertiesCount = await Property.countDocuments();

       
        res.status(200).json({
            status: 'success',
            no_of_responses: properties.length,
            all_properties: totalPropertiesCount,
            data: properties
        });
    } catch (err) {
        console.error('Error searching property records:', err);
        res.status(500).json({
            status: 'fail',
            message: err.message || 'Internal server execution error encountered.'
        });
    }
};


exports.getUsersProperties = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProperties = await Property.find({ userId: userId }).sort('-createdAt');

        res.status(200).json({
            status: 'success',
            data_length: userProperties.length,
            properties: userProperties
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};
