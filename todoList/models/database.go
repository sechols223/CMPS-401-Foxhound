package models

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectToDatabase() (*gorm.DB, error) {
	database, err := gorm.Open(mysql.Open("./database.db"), &gorm.Config{})

	if err != nil {
		log.Fatal(err.Error())
	}

	if err = database.AutoMigrate(&Task{}); err != nil {
		log.Println(err)
	}

	return database, err
}

// path: /models/database.go
