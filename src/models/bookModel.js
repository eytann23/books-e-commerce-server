const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
	{
		isbn: {
			type: Number,
			required: true,
            trim: true,
            min:1,
            unique: true
		},
		name:{
            type:String,
            required: true,
            trim: true
        },
        author:{
            type:String,
            required: true,
            trim: true
        },
        price:{
            type:Number,
            required: true,
            trim: true
        },
        cover:{
            type: Buffer,
            required: true
        }
	}
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;