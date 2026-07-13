const { test, expect, request } = require("@playwright/test");
const {APIUtils} = require('./utils/APIUtils.js')


const loginPayload = {
    userEmail: "piperbryce51@gmail.com",
    userPassword: "Mander7436"
}

const orderPayload = {
    orders: 
        [{country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3"}]
}
let response

test.beforeAll(async ()=>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload)
    response = await apiUtils.createOrder(orderPayload)
   
}) // beforeAll runs before all tests 
    
//Verify if order created is showing in history page using APi

test('Demo order app using API requests', async({page})=>{
    
    
    await page.addInitScript(value =>{
        window.localStorage.setItem('token', value)
    }, response.token)

    await page.goto(process.env.DEMOAPP_URL)

    await page.locator("button[routerlink*='order']").click() //added tagname to reduce inspected elements
    
    //wait for table to load up
    await page.locator('tbody').waitFor()
    // Retrieve no of rows and extract Order Ids from the Order History page
    const orderRows = await page.locator('tbody tr')
    // await orderRows.last().waitFor()

    const allOrderIds = await orderRows.locator('th').allTextContents()

    console.log("All Order Ids: " + allOrderIds)
    // console.log("No of Order rows: " + await orderRows.count())
    const ordersCount = await orderRows.count()
    for (let i=0; i <= ordersCount; i++){
        const rowOrderId = await orderRows.nth(i).locator('th').textContent()
        console.log("Looping through Order Id: " + rowOrderId)
        if(response.orderId.includes(rowOrderId) ){
            await orderRows.locator('button:has-text("View")').nth(i).click()
            break;
        }

    }
    const orderIdDetails = await page.locator('.col-text').textContent()
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy()

})