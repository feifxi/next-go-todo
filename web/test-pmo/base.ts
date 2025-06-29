import { TodoPage } from "./todo"
import { test as base } from "@playwright/test";


type baseFixtures = {
    todoPage: TodoPage,
}

export const test = base.extend<baseFixtures>({
    todoPage: async ({ page }, use) => {
        await use(new TodoPage(page))
    } 
})