;
'use strict';

(new function() {
    var App = this;
    this.files = ['gomoku1/js/lib.js', 'gomoku1/js/AppModel.js', 'gomoku1/js/AppView.js', 'gomoku1/js/AppController.js', 'gomoku1/js/MouseController.js'];
    //  this.files = ['js/lib.js', 'js/AppModel.js', 'js/AppView.js', 'js/AppController.js', 'js/MouseController.js'];
    this.model;
    this.view;
    this.controller;

    this.init = function() {
        this.model = new AppModel();
        this.view = new AppView(this.model);
        this.controller = new AppController(this.model, this.view);
    };

    return function() {
        var head = document.getElementsByTagName('head')[0];
        for (var i in App.files) {
            var script = document.createElement('script');
            script.src = App.files[i];
            script.onload = App.start;
            head.appendChild(script);
        }
        App.init;
    };
})();