const { test, expect } = require("@playwright/test");


test.only('Demo App', async ({page})=>{
    await page.goto(process.env.DEMOAPP_URL)
    await page.locator('#userEmail').fill(process.env.DEMOAPP_USERNAME)
    await page.locator("[type='password']").fill(process.env.DEMOAPP_PWD)
    await page.locator("#login").click()
 //REDIRECT to PRODUCTS LISTING page   
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
//REDIRECT to CART page
    await page.locator("[routerlink*='cart']").click()

    await page.locator("div li").first().waitFor()

    const bool =  await page.locator('h3:has-text("ZARA COAT 3")').isVisible()
    // const bool =  await page.locator("h3:has-text(`productName`)").isVisible() //todo:Check how to replace text with variable
    expect(bool).toBeTruthy()
//REDIRECT to CHECKOUT page
    await page.locator('button:has-text("Checkout")').click()

    //to handle auto selection dropdown
    await page.locator("[placeholder*='Country']").pressSequentially("ken",{delay:100}) //edge case as you need to capture press one key at a time; fill method will not work

    const dropdown = page.locator('.ta-results')

    await dropdown.waitFor()
    const optionsCount = await dropdown.locator("button").count()
    for(let i=0; i < optionsCount; ++i){
        const text = await dropdown.locator("button").nth(i).textContent()
        if(text.includes('Kenya')){
        // if(text.trim() === 'Kenya'){
        // if(text === 'Kenya'){

            await dropdown.locator("button").nth(i).click()
            break
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(process.env.DEMO_USERNAME)

    await page.locator('.action__submit').click()
//Assertion to confirm that order was submitted
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ')
    const currentOrderId = await page.locator(".em-spacer-1 .ng-star-inserted").first().textContent()
    // const currentOrderId = orderText.split("|")[1]

    console.log("Current Order - " + currentOrderId)

    // await page.pause()
//REDIRECT to orders page
    // await page.locator("[routerlink*='order']").first().click()
    await page.locator("button[routerlink*='order']").click() //added tagname to reduce inspected elements
    
    //wait for table to load up
    await page.locator('tbody').waitFor()
    // Retrieve no of rows and extract Order Ids from the Order History page
    const orderRows = await page.locator('tbody tr')
    // await orderRows.last().waitFor()

    const allOrderIds = await orderRows.locator('th').allTextContents()

    console.log("All Order Ids: "+allOrderIds)
    // console.log("No of Order rows: " + await orderRows.count())
    const ordersCount = await orderRows.count()
    for (let i=0; i <= ordersCount; i++){
        const orderId = await orderRows.nth(i).locator('th').textContent()
        console.log("Looping through Order Id: " + orderId)
        if( currentOrderId.includes(orderId) ){
            await orderRows.locator('button:has-text("View")').nth(i).click()
            break;
        }
    
        const orderIdDetails = await page.locator('.col-text').textContent()
        expect(currentOrderId.includes(orderIdDetails)).toBeTruthy()
    }

});