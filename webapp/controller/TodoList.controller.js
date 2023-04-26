sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.TodoList", {
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("todoList").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			this.onFindAllTodo()
		},
	
		onFindAllTodo: function () { 
			const oModel = this.getView().getModel();	
			var myTodoList = []	
			var databaseObj = oModel.getProperty("/databaseObj")
		
			databaseObj.transaction(function (tx) {
				tx.executeSql("SELECT*FROM TODOLISTS", [],
					(tx, result) => {
						for (let index = 0; index < result.rows.length; index++) {
							myTodoList.push({
								title: result.rows.item(index).Title,
								description: result.rows.item(index).Description,
								date: result.rows.item(index).Date,
								status: result.rows.item(index).Status,
								id: result.rows.item(index).id,
							})
							myTodoList.forEach(a => {
								if (a.status === 'true' || a.status === true) {
									a.status = true
								} else {
									a.status = false
								}
							})
							oModel.setProperty("/myTodoList", myTodoList)
						}
					},
					(tx, result) => {
						MessageBox.error("Failed To Get Registrations")
						console.log(result);
					})
			})
		},

		onNavButtonPress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("addTodo");
		},

		onPressTodo: function (oEvent) {
			const oModel = this.getView().getModel()
			var oRouter = this.getOwnerComponent().getRouter();
		
			var oSelectedPath = oEvent.getSource().getBindingContextPath()
			var context = oSelectedPath.split("/")[2];
			var oSelectedItems = oModel.getProperty(oSelectedPath)
		
			oModel.setProperty("/todoEditModel", oSelectedItems)
			oModel.setProperty("/todoEditModel/path", context)
		
			oRouter.navTo("todoDetail", {
				id: oSelectedItems.id
			})
		}
	});
});