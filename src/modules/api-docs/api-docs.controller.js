const HttpStatus = require('http-status-codes');
const swaggerJsDocs = require('swagger-jsdoc');

const swaggerConfig = require('./swagger-config');

class ApiDocsController {

  /**
   * @private
   * @return {Array | swaggerObject}
   */
  static getDocs(/* req, res */) {
    return swaggerJsDocs(swaggerConfig);
  }

  /**
   * /api-docs/raw
   * @param req
   * @param res
   */
  static getRaw(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(ApiDocsController.getDocs());
    res.status(HttpStatus.OK);
  }
}

module.exports = ApiDocsController;
