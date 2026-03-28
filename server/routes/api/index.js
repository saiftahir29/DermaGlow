const express = require( "express" );
const UserRoute = require( "./user" );
const AuthRoute = require( "./auth" );
const SessionRoute = require( "./session" );
const ClinicRoute = require( "./clinic" );
const RecommendationRoute = require( "./recommendation" );





const router = express.Router();

router.use( "/user", UserRoute );
router.use( "/auth", AuthRoute );
router.use( "/session", SessionRoute );
router.use( "/clinic", ClinicRoute );
router.use( "/recommendation", RecommendationRoute );





module.exports = router;
