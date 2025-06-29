import { expect } from "@playwright/test";
import { test } from "../test-pmo/base";

// test("Should fill the correct value of new todo", async ({ page }) => {
//     // POM - Page Object Model
//     const todoPage = new TodoPage(page)
    
//     await todoPage.goto()
//     await todoPage.fillNewTodoContent("Hello")
//     expect(await todoPage.getTodoContent()).toBe("Hello")
// })

test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto()
})

// Extend the test obj
test("Should fill the correct value of new todo with new fixtures", async ({ todoPage }) => {
    await todoPage.fillNewTodoContent("Hello")
    expect(await todoPage.getTodoContent()).toBe("Hello")

    await todoPage.fillNewTodoContent("Test EII")
    expect(await todoPage.getTodoContent()).toBe("Test EII")
})


test("Should disabled new todo button", async ({ todoPage }) => {
    await todoPage.fillNewTodoContent("")
    expect(todoPage.newTodoBtn.isDisabled())
})

test("Should add todo success", async ({ todoPage }) => {
    await todoPage.fillNewTodoContent("Chanom is so cool!")
    expect(todoPage.newTodoBtn.isDisabled())

    await todoPage.newTodoBtn.click()
})