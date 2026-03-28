let mongoose = require( "mongoose" );
    const slug = require( "slug" );

let SessionSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            unique: true,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        assesment: {
            skinType: String,
            mainConcern: String,
            additionalSkinConcerns: String,
            alcoholConsumption: String,
            climateType: String,
            currentRoutine: String,
            dietType: String,
            exerciseFrequency: String,
            sunscreenUsage: String,
            skinTextureDescription: String,
            productUsageFrequency: String,
            stressLevel: String,
            sunExposure: String,
            waterIntake: String,
            workEnvironment: String,
            specificSkinIssues: [ String ]
        },
        messages: [
            {
                question: { type: String },
                answer: { type: String },
                isUser: { type: Boolean, default: false },
                timestamp: { type: Date, default: Date.now },
                _id: false,
            },
        ],
        attempts: { type: Number, default: 0 },
    },
    { timestamps: true }
);

SessionSchema.pre( "validate", function ( next ) {
    if ( !this.slug ) {
        this.slugify();
    }
    next();
} );

SessionSchema.methods.slugify = function () {
    this.slug = slug( ( ( Math.random() * Math.pow( 36, 6 ) ) | 0 ).toString( 36 ) );
};

var autoPopulate = function ( next ) {
    next();
};

SessionSchema.pre( "findOne", autoPopulate );
SessionSchema.pre( "find", autoPopulate );

SessionSchema.methods.toJSON = function () {
    return {
        id: this._id,
        slug: this.slug,
        sender: this.sender,
        messages: this.messages,
        attempts: this.attempts,
        createdAt: this.createdAt,
        assesment: this.assesment
    };
};

module.exports = mongoose.model( "Session", SessionSchema );