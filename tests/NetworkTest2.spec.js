const { test, request, expect } = require("@playwright/test");
const {APIUtils} = require('./utils/APIUtils.js')

const loginPayload = {
    userEmail: "piperbryce51@gmail.com",
    userPassword: "Mander7436"
}
let loginToken

test.beforeAll(async ()=>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload)
    loginToken = await apiUtils.getAuthToken()
   
}) // beforeAll runs before all tests 
    

test('Security test request intercept', async({page})=>{

    await page.addInitScript(value =>{
        window.localStorage.setItem('token', value)
    },loginToken)

    await page.goto(process.env.DEMOAPP_URL)
    await page.waitForLoadState('networkidle')
    // await page.locator('.card-body b').first().waitFor()

    await page.locator("button[routerlink*='order']").click() //added tagname to reduce inspected elements


    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route=> route.continue(
            {
                url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'
            }
        )
    )
    /

    await page.locator('button:has-text("View")').first().click()
    await expect(page.locator('p').last()).toHaveText('You are not authorize to view this order')
})