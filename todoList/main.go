package main

import (
	"log"
	"todoList/controllers"
	"todoList/models"

	"github.com/gin-gonic/gin"
)

func main() {
	db, err := models.ConnectToDatabase()
	if err != nil {
		log.Println(err)
	}
	db.DB()

	router := gin.Default()
    
	router.GET("/tasks", controllers.GetTasks)
	router.GET("/tasks/:id", controllers.GetTaskByID)
	router.POST("/tasks", controllers.PostTask)
	router.PATCH("/tasks/:id", controllers.UpdateTask)
	router.DELETE("/tasks/:id", controllers.DeleteTask)
	router.Run("localhost:8080")
}
