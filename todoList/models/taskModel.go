package models

type Task struct {
	ID    uint   `json:"id" gorm:"primary_key"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

// path: /models/taskModel.go
