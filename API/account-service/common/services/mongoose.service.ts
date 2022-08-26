import mongoose from 'mongoose';
import debug from 'debug';
import "reflect-metadata";
import { container, injectable, singleton } from 'tsyringe';

const log: debug.IDebugger = debug('app:mongoose-service');

@singleton()
class MongooseService {
    static getMongoose(): any{
      return mongoose;
    }
    
    private count = 0;
    private mongooseOptions = {
      serverSelectionTimeoutMS: 5000,
    }

    constructor() {
        this.connectWithRetry();
    }

    getMongoose = () => {
        return mongoose;
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)');
        mongoose
            .connect('mongodb://localhost:27017/api-db', this.mongooseOptions)
            .then(() => {
                log('MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default MongooseService;
