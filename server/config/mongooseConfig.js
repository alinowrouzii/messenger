import mongoose from 'mongoose';

export const mongooseConfig = async () => {
    let MONGO_URL;
    if (process.env.NODE_ENV === "development") {
        MONGO_URL = `mongodb://localhost:27017/DevDB`
    } else {
        MONGO_URL = process.env.MONGO_URL;
    }

    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB connected!!');
    } catch (error) {
        console.log(`${error} mongoDB didn't connect!`);
    }
}