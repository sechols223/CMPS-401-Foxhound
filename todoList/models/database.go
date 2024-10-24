package models

import (
	"log"

	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
    "net/url"
    "fmt"
)

func ConnectToDatabase() (*gorm.DB, error) {
  

    // Fetch credentials from environment variables or configuration
    user := "foxhound-admin"
    password := "CMPS401!"
    server := "foxhound-db-server.database.windows.net"
    port := 1433
    databaseName := "Foxhound"

    // URL-encode the password in case it has special characters
    password = url.QueryEscape(password)

    // Build the DSN (Data Source Name)
    dsn := fmt.Sprintf("sqlserver://%s:%s@%s:%d?database=%s&encrypt=true",
        user, password, server, port, databaseName)

    database, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal(err.Error())
	}

	if err = database.AutoMigrate(&Task{}); err != nil {
		log.Println(err)
	}

	return database, err
}

// path: /models/database.go
