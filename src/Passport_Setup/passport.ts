import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, UserData } from '../db/Models/User_model';
import { v4 as uuidv4 } from 'uuid';


passport.use(new GoogleStrategy({
    clientID: process.env.Google_id || '',
    clientSecret: process.env.Google_secret || '',
    callbackURL: 'http://localhost:3000/auth/google'
  }, async (accessToken: string, refreshToken: string, profile, cb) => {
    try {
      const { name, email, picture } = profile._json;
      
      let user = await User.findOne({ email });
      
      if (!user) {
        const id = uuidv4();
        user = await User.create({
          Uid: id,
          name: name || '',
          email: email || '',
          avatar: picture,
          password: '-1',
          lastSeen: new Date().toISOString(),
        });
      }
      
      if (user) {
        const accessToken = user.generateAccessToken?.(); 
        const refreshToken = user.generateSecretToken?.(); 

        if (accessToken && refreshToken) {
          
            cb(null, { accessToken, refreshToken });
        
        } else {
          throw new Error('Failed to generate tokens');
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error:any) {
      cb(error, false);
    }
  }));
  
// Serialize and deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
