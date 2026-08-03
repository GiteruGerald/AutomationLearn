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
const fakePayloadOrders = {data:[],message:"No Orders"}

test.beforeAll(async ()=>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload)
    response = await apiUtils.createOrder(orderPayload)
   
}) // beforeAll runs before all tests 
    
//Verify if order created is showing in history page using APi

test('Intercepting Network requests', async({page})=>{
    
    
    await page.addInitScript(value =>{
        window.localStorage.setItem('token', value)
    }, response.token)

    await page.goto(process.env.DEMOAPP_URL)
    // await page.locator('.card-body b').first().waitFor()

    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', //Using asterisk as a wildcard to accept any user id
        async route=>{
            //Intercepting response and send back fake response(data) to browser which can then be rendered
            const realResponsefromServer =  await page.request.fetch(route.request())
            let body = JSON.stringify(fakePayloadOrders)
            route.fulfill({
                response,
                body
            })
        }
    )
    await page.locator("button[routerlink*='order']").click() //added tagname to reduce inspected elements
    // await page.pause()
    await page.waitForResponse('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*')
    await expect(page.locator('.mt-4')).toHaveText('You have No Orders to show at this time. Please Visit Back Us ')

})