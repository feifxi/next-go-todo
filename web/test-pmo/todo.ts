import { Locator, Page, } from "@playwright/test"

export class TodoPage {    
    page: Page 
    baseURL: string
    newTodoInput: Locator
    newTodoBtn: Locator
    todoItem: Locator

    constructor(page : Page){
        this.page = page
        this.baseURL = "http://localhost:3000"
        this.newTodoInput = page.locator("#new-todo-input")
        this.newTodoBtn = page.locator("#new-todo-btn")
        this.todoItem = page.locator(".todo-item")
    }

    async goto() {
        await this.page.goto(this.baseURL)
    }

    async fillNewTodoContent(content: string) {
        await this.newTodoInput.fill(content)
    }

    async getTodoContent(): Promise<string> {
        return await this.newTodoInput.inputValue()
    }

    async clickSubmitNewTodoBtn() {
        await this.newTodoBtn.click()
    }
}