const { ROLES } = require('./config/data');

function authUser(req, res, next) {
	if (req.user == null) {
		return res.sendStatus(401);
	}
	next();
}

function authAdmin(req, res, next) {
	if (req.user == null) {
		return res.sendStatus(401);
	} else if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.MASTER) {
		return res.sendStatus(403);
	}
	next();
}

function authMaster(req, res, next) {
	if (req.user == null) {
		return res.sendStatus(401);
	} else if (req.user.role !== ROLES.MASTER) {
		return res.sendStatus(403);
	}
	next();
}

module.exports = {
	authUser,
	authAdmin,
	authMaster
};
