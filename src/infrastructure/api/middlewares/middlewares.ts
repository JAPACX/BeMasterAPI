import { Express } from "express";
import bodyParser from "body-parser";

import fileUpload from "express-fileupload";

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "../../../infrastructure/api/swagger/swagger";

export const setupMiddlewares = (app: Express) => {
  // body parser
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(fileUpload());

  // Swagger setup
  const specs = swaggerJsDoc(options);
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
};
