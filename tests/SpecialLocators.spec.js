const {test, expect } = require("@playwright/test")

test.only('Playwright Special Locators',async({page})=>{
    await page.goto(process.env.UNIQUEAPP_URL)

    await page.getByLabel('Check me out if you Love IceCreams!').click()
    await page.getByLabel('Gender').selectOption('Male')
    await page.getByPlaceholder('Password').fill('abc123')
    await page.getByRole('button',{name:'Submit'}).click()
    
    const bool = await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    expect(bool).toBeTruthy

    await page.getByRole('link',{name:'Shop'}).click()
    await page.locator('app-card').filter({hasText:'Nokia Edge'}).getByRole('button').click()
    // await page.pause()
})