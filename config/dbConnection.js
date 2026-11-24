
import mongoose from 'mongoose';
import dns from 'node:dns';

// Use public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected Database:", mongoose.connection.name);

        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
