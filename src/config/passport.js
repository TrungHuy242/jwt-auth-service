const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const prisma = require("./prisma");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails?.[0]?.value;
        const googleAvatar = profile.photos?.[0]?.value;

        if (!googleEmail) {
          return done(null, false, {
            message: "Không lấy được email từ Google",
          });
        }

        let user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                provider: "google",
                providerId: profile.id,
              },
              {
                email: googleEmail,
              },
            ],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName || "Google User",
              email: googleEmail,
              password: null,
              provider: "google",
              providerId: profile.id,
              avatar: googleAvatar,
              isVerified: true,
              role: "USER",
            },
          });
        } else {
          user = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              provider: user.provider === "local" ? user.provider : "google",
              providerId: user.providerId || profile.id,
              avatar: user.avatar || googleAvatar,
              isVerified: true,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const facebookEmail = profile.emails?.[0]?.value;
          const facebookAvatar = profile.photos?.[0]?.value;
  
          if (!facebookEmail) {
            return done(null, false, {
              message: "Không lấy được email từ Facebook",
            });
          }
  
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                {
                  provider: "facebook",
                  providerId: profile.id,
                },
                {
                  email: facebookEmail,
                },
              ],
            },
          });
  
          if (!user) {
            user = await prisma.user.create({
              data: {
                name: profile.displayName || "Facebook User",
                email: facebookEmail,
                password: null,
                provider: "facebook",
                providerId: profile.id,
                avatar: facebookAvatar,
                isVerified: true,
                role: "USER",
              },
            });
          } else {
            user = await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                provider: user.provider === "local" ? user.provider : "facebook",
                providerId: user.providerId || profile.id,
                avatar: user.avatar || facebookAvatar,
                isVerified: true,
              },
            });
          }
  
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;