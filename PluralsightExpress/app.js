var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var port = 3000;
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/bookAPI');

var Book = require('./models/bookModel');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


var bookRouter = express.Router();

bookRouter.route('/')
    .post(function(req, res) {
        var book = new Book(req.body);
        book.save();
        //console.log(book);
        res.status(201).send(book);
    })
    .get(function(req, res) {
        //======sanitize requests
        var query = {};

        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        //====end of sanitization
        Book.find(function(err, books) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(books)
            }
        });
    });
bookRouter.use('/:bookId', function(req,res,next){
	Book.findById(req.params.bookId, function(err, book) {
        if (err) {
            res.status(500).send(err);
        } else if(book){
            req.book = book;
            next();
        }else{
        	res.status(404).send('no book found');
        }
    })
})
bookRouter.route('/:bookId')

.get(function(req, res) {
    res.json(book);
})
.put(function(req, res) {
    Book.findById(req.params.bookId, function(err, book) {
        if (err) {
            res.status(500).send(err);
        } else {
        	req.book.title = req.body.title;
        	req.book.author = req.body.author;
        	req.book.genre = req.body.genre;
        	req.book.read = req.body.read;
        	
        	book.save(function(err){
        		if(err){
        			res.status(500).send(err);
        		}else{
        			res.json(req.book);
        		}
        	});
            
        }
    })
})
.patch(function(req,res){
	if (req.body._id){
		delete req.body._id;
	}else{
		for (var i in req.body){
			req.book[i] = req.body[i];
		}
		req.book.save(function(err){
			if(err){
				res.status(500).send(err);
			}else{
				res.json(req.book);
			}
		})
	}
})
.delete(function(req,res){
	req.book.remove(function(err){
		if(err){
				res.status(500).send(err);
			}else{
				res.status(204).send('book deleted');
			}
	})
})
app.use('/api/books', bookRouter);
//app.use('/api/authors', authorRouter);
app.get('/', function(req, res) {
    res.send('welcome to the api')
})


app.listen(3000, function() {
    console.log('http://localhost:3000/')
})









/*


{
	"title":"Web Development",
	"author":"Beercan",
	"genre":"Education"
}






*/