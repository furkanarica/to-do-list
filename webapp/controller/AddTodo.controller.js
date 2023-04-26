sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";
	
	var myTodoList = {
		"MyTodoList": []
	}
	
	const databaseObj = openDatabase("Todolist", 1.0, "TodoList Database", 2 * 1024 * 1024)

	databaseObj.transaction(function (tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS TODOLISTS (id INTEGER PRIMARY KEY,Title,Description,Date,Status)");

	})

	return Controller.extend("sap.ui.demo.walkthrough.controller.AddTodo", {
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("addTodo").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			const oModel = this.getView().getModel()

			var todoData = {
				Title: "",
				Description: "",
				Date: "",
			}
			oModel.setProperty("/todoData", todoData)
			oModel.setProperty("/myTodoList", [])
			oModel.setProperty("/databaseObj", databaseObj)
		},

		onCreateTodo: function () { 
			const oModel = this.getView().getModel()
    	
			const title = oModel.getProperty("/todoData/Title")
			const description = oModel.getProperty("/todoData/Description")
			const date = oModel.getProperty("/todoData/Date")
			const status = false
		
			databaseObj.transaction(function (tx) {
				tx.executeSql("INSERT INTO TODOLISTS(Title,Description,Date,Status) VALUES (?,?,?,?)",
					[title, description, date, status],
					(tx, result) => {
						myTodoList.MyTodoList.push({
							title: oModel.getProperty("/todoData/Title"),
							description: oModel.getProperty("/todoData/Description"),
							date: oModel.getProperty("/todoData/Date"),
							status: false,
							id: result.insertId
						})
						oModel.setProperty("/myTodoList", myTodoList.MyTodoList)
						MessageToast.show("Registration Added")
					},
					(tx, result) => {
						MessageBox.error("Unable to Add Registration")
						console.log(result)
					})
			})
		},

		onPressTodoLists: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("todoList");
		}
	});
});