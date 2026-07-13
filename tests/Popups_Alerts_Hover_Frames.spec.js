const { test, expect } = require("@playwright/test");

test("Popup validations", async({page})=>{
    await page.goto(process.env.POPUPAPP_URL)
    // await page.goto('http://google.com')
    // await page.goBack()
    // await page.goForward()

    await expect (page.locator('#displayed-text')).toBeVisible()
    await page.locator('#hide-textbox').click()
    await expect (page.locator('#displayed-text')).toBeHidden()
    
//TO handle alert popups
    await page.locator('#confirmbtn').click()
    page.on('dialog', dialog => dialog.accept())
// page.on('dialog', dialog => dialog.dismiss())

//For hover over elements
    await page.getByRole('button', { name: 'Mouse Hover' }).hover()
    await page.pause()

//Handling iFrames; have to switch to child frame first by locating the frame tag name or id. After, you can perform operations on the frames locator. better to instantiate it to a constant 
    const framesPage =  page.frameLocator('#courses-iframe')
    await framesPage.locator("li a[href*='lifetime-access']:visible").click() //from inspecting, resolves to 2 elements. However, adding the visible attribute will choose the visible element out of the two

    const textCheck =  framesPage.locator('h1:visible').textContent()
    console.log(textCheck)
})