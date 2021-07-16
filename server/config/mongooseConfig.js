import mongoose from 'mongoose';

export const mongooseConfig = async () => {
    const MONGIOSE_URL = process.env.MONGOOSE_URL_2;

    try {
        await mongoose.connect(MONGIOSE_URL, {
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