var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimelineSchema = new Schema(
    {
        time: { type: Date },
        file_name: { type: String, required: true, max: 100 },
        action: { type: String },
    }, {
        collection: 'timelines'
    }
);

// Virtual for author's URL
TimelineSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

//Export model
module.exports = mongoose.model('timeline', TimelineSchema);