sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.TodoDetail", {
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("todoDetail").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			this.getView().bindElement({
				path: oEvent.getParameter("arguments").id,
			})
		},

		onNavButtonPress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("todoList");
		},

		onSelectStatus: function (oEvent) {
			const oModel = this.getView().getModel()
			var statusValue = oEvent.getParameter('selected')
			oModel.setProperty("/todoEditModel/status", statusValue)
		},

		onRemoveTodo: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			const oModel = this.getView().getModel();
			const databaseObj = oModel.getProperty("/databaseObj")
			const myTodoList = oModel.getProperty("/myTodoList")

			var context = oModel.getProperty("/todoEditModel/path")
			var deleteId = oModel.getProperty("/todoEditModel/id")
		
			databaseObj.transaction(function (tx) {
				tx.executeSql("DELETE FROM TODOLISTS WHERE id=?",
					[deleteId],
					(tx, result) => {
						myTodoList.splice(context, 1)
	
						oModel.setProperty("/myTodoList", myTodoList)
						MessageToast.show("Registration Deleted")
					},
					(tx, result) => {
						MessageBox.error("Unable to Delete Registration ")
						console.log(result);
					})
				oRouter.navTo("todoList");
			})
		},

		onUpdateTodo: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			const oModel = this.getView().getModel()
			var databaseObj = oModel.getProperty("/databaseObj")
		
			var title = oModel.getProperty("/todoEditModel/title")
			var description = oModel.getProperty("/todoEditModel/description")
			var date = oModel.getProperty("/todoEditModel/date")
			var status = oModel.getProperty("/todoEditModel/status")
		
			var updateId = oModel.getProperty("/todoEditModel/id")
		
			databaseObj.transaction(function (tx) {
				tx.executeSql("UPDATE TODOLISTS SET Title=?, Description=?, Date=?,Status=? WHERE id=?",
					[title, description, date, status, updateId],
					(tx, result) => {
						MessageToast.show("Registration Updated")
					},
					(tx, result) => {
						MessageBox.error("Update Failed")
						console.log(result);
					})
				oRouter.navTo("todoList");
			})
		}
	});
});