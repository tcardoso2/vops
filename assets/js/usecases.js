/****************************************************
Application USE-CASES
****************************************************/
//Use identifies the main application by any unique name
_uce = uce('MyApplication')

_uce.ready(function (e) {
  //Will log in browser console
  _uce.logInConsole = true;
  //Calls the Map server side service to get the number of tiles required
  md = new MapDelegate();
  //Need to wait for the response from the server:
  md.size(function (response) {
    _uce.log("Got response from map size service:" + JSON.stringify(response));
    _uce.log('Done. setting isometric map size...');
    Core.IsometricMap.m.tilesData.length.x = response.x;
    Core.IsometricMap.m.tilesData.length.y = response.y;

    _uce.log('Creating Main Application MVC structure... to be deprecated?')
          .setModel(new MexampleI3_3())
          .setViewer(new VexampleI3_3())
          .setController(new CexampleI3_3());

    _uce.log('Done. Adding main control panel...');
    uce('zisomap').raise('create')
          .log('Adding use-cases...')
          .SetRunControllerAutomatically(true)
          //USECASE 1: React to object found
          .addusecase('showObjectMenu', 'uc_zisomap_object_found', function (e) {})
          //USECASE 2: React to object mouse over
          .addusecase('showObjectTitle', 'uc_zisomap_object_mouseover', function (e) {})
          //USECASE 3: ESC delete existing menus
          .addusecase('deleteMenus', 'uc_zcpanel_esc', function (e) {})
          //USECASE 4: create map item
          .addusecase('on_inserted_item', 'uc_zisomap_on_inserted_item', function (e) {})
          //USECASE 5: delete map item
          .addusecase('on_deleted_item', 'uc_zisomap_on_deleted_item', function (e) {});
  });
});
