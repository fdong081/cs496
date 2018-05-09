var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EditTimeSchema = new Schema(
    {
        file_name: { type: String, required: true, max: 100 },
        edit_time: { type: Number },
    }, {
        collection: 'edittimes'
    }
);

// Virtual for author's URL
EditTimeSchema
    .virtual('url')
    .get(function () {
        return '/catalog/' + this._id;
    });

//Export model
module.exports = mongoose.model('edittime', EditTimeSchema);