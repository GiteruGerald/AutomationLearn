const { test } = require("@playwright/test");


test.only('Demo App', async ({page})=>{
    await page.goto(process.env.DEMO_URL)
    await page.locator('#userEmail').fill(process.env.DEMO_USERNAME)
    await page.locator("[type='password']").fill(process.env.DEMO_PWD)
    
    const products = page.locator(".card-body")
    const titles = await page.locator(".card-body b").allTextContents()
    const productsCount = await products.count()
    const productName = 'ZARA COAT 3'
    
    await page.locator("#login").click()
    
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor()

    for (let i=0; i< productsCount; ++i){
        
        if(await products.nth(i).locator("b").textContent() === productName){
            //add product to cart
            await products.nth(i).locator("text= Add To Cart").click()
            break
        }

    }

    await page.pause()

    //ZARA COAT 3

});