import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MONGODB_URI 또는 MONGO_URI 모두 지원
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!uri) {
      console.error('❌ MONGODB_URI 또는 MONGO_URI 환경변수 누락!');
      console.log('🚀 Server continues without DB...');
      return;  // ← 추가: 에러 없이 계속 진행
    }
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // MongoDB 연결 이벤트 리스너
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log('🚀 Server continues without DB...');
    // process.exit(1);  // ← 주석처리: 서버 계속 실행
  }
};

export default connectDB;
