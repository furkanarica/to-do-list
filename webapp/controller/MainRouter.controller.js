sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.MainRouter", {
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("mainRouter").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("addTodo");
		},

	});

});