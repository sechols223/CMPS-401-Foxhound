package controllers

import (
	"log"
	"net/http"
	"todoList/models"

	"github.com/gin-gonic/gin"
    "sync"
)

var wg sync.WaitGroup;

type NewTask struct {
	Title string `json:"title" binding:"required"`
}

type TaskUpdate struct {
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

func GetTasks(context *gin.Context) {

 var tasks []models.Task
  db, err := models.ConnectToDatabase()
  if err != nil {
      log.Println(err)
  }
  if err := db.Find(&tasks).Error; err != nil {
      context.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
      return
  }
  context.IndentedJSON(http.StatusOK, tasks)
}

func GetTaskByID(context *gin.Context) {

  var task models.Task

  db, err := models.ConnectToDatabase()
  if err != nil {
      log.Println(err)
  }

  if err := db.Where("id= ?", context.Param("id")).First(&task).Error; err != nil {
      context.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
      return
  }
  context.IndentedJSON(http.StatusOK, task)
}

func PostTask(context *gin.Context) {
  var task NewTask

  if err := context.ShouldBindJSON(&task); err != nil {
      context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
  }

  newTask := models.Task{Title: task.Title}

  db, err := models.ConnectToDatabase()
  if err != nil {
      log.Println(err)
      context.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
      return
  }

  if err := db.Create(&newTask).Error; err != nil {
      context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
  }
  context.IndentedJSON(http.StatusCreated, newTask)
}

func UpdateTask(context *gin.Context) {
  var task models.Task

  db, err := models.ConnectToDatabase()
  if err != nil {
      log.Println(err)
  }

  if err := db.Where("id = ?", context.Param("id")).First(&task).Error; err != nil {
      context.JSON(http.StatusNotFound, gin.H{"error": "Task not found!"})
      return
  }

  var updatedTask TaskUpdate

  if err := context.ShouldBindJSON(&updatedTask); err != nil {
      context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
  }

  if err := db.Model(&task).Updates(models.Task{Title: updatedTask.Title, Done: updatedTask.Done}).Error; err != nil {
      context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
  }
  context.IndentedJSON(http.StatusOK, task)
}

func DeleteTask(context *gin.Context) {
  var task models.Task

  db, err := models.ConnectToDatabase()
  if err != nil {
      log.Println(err)
  }

  if err := db.Where("id = ?", context.Param("id")).First(&task).Error; err != nil {
      context.JSON(http.StatusNotFound, gin.H{"error": "Task not found!"})
      return
  }

  if err := db.Delete(&task).Error; err != nil {
      context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
  }
  context.IndentedJSON(http.StatusOK, gin.H{"message": "Task deleted"})
}

// path: /controllers/taskControllers.go
