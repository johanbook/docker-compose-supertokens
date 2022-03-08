const cors = require("cors");
const morgan = require("morgan");
// const helmet = require("helmet");
let supertokens = require("supertokens-node");
let Session = require("supertokens-node/recipe/session");
let {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
let {
  middleware,
  errorHandler,
} = require("supertokens-node/framework/express");
let EmailPassword = require("supertokens-node/recipe/emailpassword");

const apiDomain = process.env.API_URL || `http://localhost`;
const websiteDomain = process.env.UI_URL || `http://localhost`;

supertokens.init({
  framework: "express",
  appInfo: {
    appName: "Authentication Server",
    apiDomain,
    websiteDomain,
  },
  recipeList: [EmailPassword.init(), Session.init()],
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_URL,
  },
});

module.exports = function (app) {
  app.use(
    cors({
      origin: websiteDomain, // TODO: Change to your app's website domain
      allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
      methods: ["GET", "PUT", "POST", "DELETE"],
      credentials: true,
    })
  );

  app.use(morgan("dev"));
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: false,
  //   })
  // );
  app.use(middleware());

  // custom API that requires session verification
  app.get("/sessioninfo", verifySession(), async (req, res) => {
    let session = req.session;
    res.send({
      sessionHandle: session.getHandle(),
      userId: session.getUserId(),
      accessTokenPayload: session.getAccessTokenPayload(),
    });
  });

  app.use(errorHandler());
  app.use((err, req, res, next) => {
    res.status(500).send("Internal error: " + err.message);
  });
};
