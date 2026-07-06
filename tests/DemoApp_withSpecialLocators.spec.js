const { test, expect } = require("@playwright/test");


test('Demo App With Special Locators', async ({page})=>{
    await page.goto(process.env.DEMOAPP_URL)
    await page.getByPlaceholder('email@example.com').fill(process.env.DEMOAPP_USERNAME)
    await page.getByPlaceholder('enter your passsword').fill(process.env.DEMOAPP_PWD)
    await page.getByRole('button',{name:'Login'}).click()
 //REDIRECT to PRODUCTS LISTING page   
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor()
    const productName = "ZARA COAT 3"
    await page.locator(".card-body").filter({hasText:productName}).getByRole('button',{name:'Add To Cart'}).click()
    
//REDIRECT to CART page
    await page.getByRole('listitem').getByRole('button',{name:'Cart'}).click()
    
    await page.locator("div li").first().waitFor()
    await expect(page.getByText(productName)).toBeVisible()

//REDIRECT to CHECKOUT page
    await page.getByRole('button',{name:'Checkout'}).click()

    //to handle auto selection dropdown
    await page.getByPlaceholder('Select Country').pressSequentially("ken",{delay:100}) //edge case as you need to capture press one key at a time; fill method will not work

    await page.getByRole('button',{name: "Kenya"}).nth(0).click()

    await page.getByText('PLACE ORDER').click()

//Assertion to confirm that order was submitted
    await expect(page.getByText(' Thankyou for the order. ')).toBeVisible
    const currentOrderId = await page.locator(".em-spacer-1 .ng-star-inserted").first().textContent()
    // const currentOrderId = orderText.split("|")[1]

    console.log("Current Order - " + currentOrderId)

//REDIRECT to orders page
    // await page.locator("button[routerlink*='order']").click() //added tagname to reduce inspected elements
        await page.getByRole('listitem').getByRole('button',{name:'ORDERS'}).click()

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
            await orderRows.getByRole('button',{name:'View'}).nth(i).click()
            break;
        }
    
        const orderIdDetails = await page.locator('.col-text').textContent()
        expect(currentOrderId.includes(orderIdDetails)).toBeTruthy()
    }

});