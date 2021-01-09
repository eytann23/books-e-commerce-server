const express = require("express");
const multer = require("multer");
const Book = require("../models/bookModel");


const router = new express.Router();

const upload = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file || !file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error ('An image is missing'))
        }

        cb(undefined,true)
    }
})

router.post("/books/add",upload.single('cover'), async (req, res) => {
	const book = new Book({...req.body});
    
	try {
        book.cover=req.file.buffer;        
        await book.save();
		res.send(book);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get("/books/get", async (req, res) => {
	const isbn = req.query.isbn;
	try {
		const book = await Book.findOne({ isbn });
		if (!book) {
			return res.status(404).send({
				status: 404,
				message: "No book",
			});
        }
        console.log(book)
		res.send(book);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/books/get-all", async (req, res) => {
	try {
		const books = await Book.find({});
        
		if (!books) {
			return res.status(404).send({
				status: 404,
				message: "No books",
			});
		}

		res.send(books);
	} catch (err) {
		res.status(500).send(err);
	}
});



module.exports = router;
