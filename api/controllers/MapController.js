/**
 * MapController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `MapController.name()`
   */
  name: function (req, res) {
    return res.json({
      todo: 'name() is not implemented yet!'
    });
  },


  /**
   * `MapController.size()`
   */
  size: function (req, res) {
    return res.json({
      x: 15,
      y: 10
    });
  }
};

