(function (routeController) {
var Cloudant = require('cloudant');

var credentials = {
    "username": "5abe15f8-d4f0-4d21-8253-0e9d80944dbb-bluemix",
    "password": "dcfa22daf5176cecc97b2df3676fe91888e57d127f901e547de91d74b7459e5b",
    "host": "5abe15f8-d4f0-4d21-8253-0e9d80944dbb-bluemix.cloudant.com",
    "port": 443,
    "url": "https://5abe15f8-d4f0-4d21-8253-0e9d80944dbb-bluemix:dcfa22daf5176cecc97b2df3676fe91888e57d127f901e547de91d74b7459e5b@5abe15f8-d4f0-4d21-8253-0e9d80944dbb-bluemix.cloudant.com"
};
var authorData = [];

// Initialize the library with my account. 
var cloudant = Cloudant({ account: credentials.username, password: credentials.password });

cloudant.db.list(function (err, allDbs) {
    console.log('All my databases: %s', allDbs.join(', '))
});

var db = cloudant.db.use("applicants");

db.find({
    selector: {
        "_id": {
            "$gt": 0
        }
    }
}, function (er, result) {
    if (er) {
        throw er;
    }

    console.log('Found %d documents with name Alice', result.docs.length);
    for (var i = 0; i < result.docs.length; i++) {
        authorData.push(JSON.stringify(result.docs[i]));
        // console.log('  Doc id: %s', JSON.stringify(result.docs[i]));
    }

    console.log(authorData);
});

    // var authorData = require('./../data/authors.json');


    function fetchAuthor(id) {
        for (var i = 0; i < authorData.length; i++) {
            if (authorData[i].id == id) {
                return authorData[i];
            }
        }
    }

    routeController.init = function (app) {

        app.get('/searchdata', function (req, res) {
            res.json({
                searchData: authorData
            });
        });

        app.get('/details/:id', function (req, res) {
            var author = fetchAuthor(req.params.id);
            res.json({
                details: {
                    id: author.id,
                    title: author.title,
                    content: author.content
                }
            });
        });

    };

})(module.exports);