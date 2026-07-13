const { test, expect, request } = require("@playwright/test");
    
//Login API
const loginPayload = {
    userEmail: "piperbryce51@gmail.com",
    userPassword: "Mander7436"
}

const orderPayload = {
    orders: 
        [
        {country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3"
        }
    ]
}
let loginToken
let orderId

test.beforeAll(async ()=>{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
        {data:loginPayload}
    )
    expect(loginResponse.ok).toBeTruthy
    const loginResponseJson = await loginResponse.json() 
    loginToken = loginResponseJson.token 
    console.log(loginToken)

    // Create Order API
    const orderResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',{
        data:orderPayload,
        headers:{
            'Authorization': loginToken,
            'Content-Type': 'application/json'
        }
    })
    const orderResponseJson = await orderResponse.json()
    console.log(orderResponseJson)
    orderId = orderResponseJson.orders[0]


}) // beforeAll runs before all tests 
    
// test.beforeEach( ()=>{ }) //beforeEach runs before each test

test('Demo order app using API requests', async({page})=>{

    const orderId = createOrder()
    await page.addInitScript(value =>{
        window.localStorage.setItem('token', value)
    }, loginToken)

    await page.goto(process.env.DEMOAPP_URL)
//     const productName = 'ZARA COAT 3'
//  //REDIRECT to PRODUCTS LISTING page   
//     const products = await page.locator(".card-body")
//     await page.locator(".card-body b").first().waitFor()    
//     const productsCount =  await products.count()

//     for (let i=0; i < productsCount; ++i){

//         if(await products.nth(i).locator("b").textContent() === productName){
//             //add product to cart
//             await products.nth(i).locator('button').nth(i).click()
//             // await products.nth(i).locator("text= Add To Cart").click()
//             // await page.getByRole('button', { name: ' Add To Cart' }).nth(i).click()
//             // await page.getByRole('button', { name: 'Add To Cart' }).click()  //will resolve to muliple elements
//             break
//         }
//     }
//REDIRECT to CART page
//     await page.locator("[routerlink*='cart']").click()

//     await page.locator("div li").first().waitFor()

//     const bool =  await page.locator('h3:has-text("ZARA COAT 3")').isVisible()
//     // const bool =  await page.locator("h3:has-text(`productName`)").isVisible() //todo:Check how to replace text with variable
//     expect(bool).toBeTruthy()
// //REDIRECT to CHECKOUT page
//     await page.locator('button:has-text("Checkout")').click()

//     //to handle auto selection dropdown
//     await page.locator("[placeholder*='Country']").pressSequentially("ken",{delay:100}) //edge case as you need to capture press one key at a time; fill method will not work

//     const dropdown = page.locator('.ta-results')

//     await dropdown.waitFor()
//     const optionsCount = await dropdown.locator("button").count()
//     for(let i=0; i < optionsCount; ++i){
//         const text = await dropdown.locator("button").nth(i).textContent()
//         if(text.includes('Kenya')){
//         // if(text.trim() === 'Kenya'){
//         // if(text === 'Kenya'){

//             await dropdown.locator("button").nth(i).click()
//             break
//         }
//     }

//     await expect(page.locator(".user__name [type='text']").first()).toHaveText(process.env.DEMOAPP_USERNAME)

//     await page.locator('.action__submit').click()
// //Assertion to confirm that order was submitted
//     await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ')
//     const currentOrderId = await page.locator(".em-spacer-1 .ng-star-inserted").first().textContent()
//     // const currentOrderId = orderText.split("|")[1]

//     console.log("Current Order - " + currentOrderId)

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

    console.log("All Order Ids: " + allOrderIds)
    // console.log("No of Order rows: " + await orderRows.count())
    const ordersCount = await orderRows.count()
    for (let i=0; i <= ordersCount; i++){
        const rowOrderId = await orderRows.nth(i).locator('th').textContent()
        console.log("Looping through Order Id: " + rowOrderId)
        if( orderId.includes(rowOrderId) ){
            await orderRows.locator('button:has-text("View")').nth(i).click()
            break;
        }

    }
    const orderIdDetails = await page.locator('.col-text').textContent()
    await page.pause()
    expect(orderId.includes(orderIdDetails)).toBeTruthy()

//Verify if order created is showing in history page using APi
//Precondition- create order API - search it in histories
})