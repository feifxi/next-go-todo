package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)
type Todo struct {
    ID        int       `json:"id"`
    Content   string    `json:"content"`
    Completed bool      `json:"completed"`
}

var db *gorm.DB

func initDatabase() {
    var err error
	dsn := "host=localhost port=5432 dbname=mydatabase user=myuser password=mypassword sslmode=disable"
    db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }

    db.AutoMigrate(&Todo{})
}

func main() {
    initDatabase()

    r := gin.Default()
    r.Use(cors.Default())

    apiRoute := r.Group("/api")
    apiRoute.POST("/todos", createTodo)
    apiRoute.GET("/todos", getTodos)
    apiRoute.GET("/todos/:id", getTodo)
    apiRoute.PUT("/todos/:id", updateTodo)
    apiRoute.DELETE("/todos/:id", deleteTodo)

    r.Run()
}

func createTodo(c *gin.Context) {
    var todo Todo
    if err := c.ShouldBindJSON(&todo); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
	todo.Completed = false
    db.Create(&todo)
    c.JSON(http.StatusCreated, todo)
}

func getTodos(c *gin.Context) {
    var todos []Todo
    db.Order("id").Find(&todos)
    c.JSON(http.StatusOK, todos)
}

func getTodo(c *gin.Context) {
    var todo Todo
    if err := db.First(&todo, c.Param("id")).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
        return
    }
    c.JSON(http.StatusOK, todo)
}

func updateTodo(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo id"})
        return
    }

    var todo Todo
    if err := db.First(&todo, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
        return
    }

    var body Todo
    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    todo.Content = body.Content
    todo.Completed = body.Completed
    db.Save(&todo)

    c.JSON(http.StatusOK, todo)
}

func deleteTodo(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo id"})
        return
    }

    var todo Todo
    if err := db.First(&todo, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
        return
    }

    db.Delete(&todo)
    c.Status(http.StatusNoContent)
}