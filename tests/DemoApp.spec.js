const { test, expect } = require("@playwright/test");


test.only('Demo App', async ({page})=>{
    await page.goto(process.env.DEMO_URL)
    await page.locator('#userEmail').fill(process.env.DEMO_USERNAME)
    await page.locator("[type='password']").fill(process.env.DEMO_PWD)
    await page.locator("#login").click()
    
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor()
    
    // const titles = await page.locator(".card-body b").allTextContents()
    const products = await page.locator(".card-body")
    const productsCount =  await products.count()
    
    const productName = 'ZARA COAT 3'

    for (let i=0; i < productsCount; ++i){

        if(await products.nth(i).locator("b").textContent() === productName){
            //add product to cart
            await products.nth(i).locator('button').nth(i).click()
            // await products.nth(i).locator("text= Add To Cart").click()
            // await page.getByRole('button', { name: ' Add To Cart' }).nth(i).click()
            // await page.getByRole('button', { name: 'Add To Cart' }).click()  //will resolve to muliple elements
            break
        }
    }

    await page.locator("[routerlink*='cart']").click()

    await page.locator("div li").first().waitFor()

    const bool =  await page.locator('h3:has-text("ZARA COAT 3")').isVisible()
    // const bool =  await page.locator("h3:has-text(`productName`)").isVisible() //todo:Check how to replace text with variable
    expect(bool).toBeTruthy()

    // await page.pause()

    //ZARA COAT 3

});