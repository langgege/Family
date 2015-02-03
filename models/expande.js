var mongodb = require('./db');

function Expande(username,costtype,cost,time) {
	this.costtype = costtype;
	this.cost = cost;
	this.username = username;

	if(time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
};

module.exports = Expande;

Expande.prototype.save = function save(callback) {

	var expande = {
		costtype: this.costtype,
		cost: this.cost,
		username: this.username,
		time: this.time,
	};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('expande', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			// collection.ensureIndex('user');
      console.log(expande);
			collection.insert(expande, {safe: true}, function(err, expande) {
				mongodb.close();
				callback(err, expande);
			});
		});
	});
};

Expande.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('expande', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (username) {
				query.username = username;
			}
			collection.find(query).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}

				var expandes = [];
				docs.forEach(function(doc, index) {
					var expande = new Expande(doc.username,doc.costtype,doc.cost,doc.time);
					expandes.push(expande);
				});
				callback(null, expandes);
			});
		});
	});
};
