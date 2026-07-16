class APIUtils
{
    constructor(apiContext, loginPayload)
    {
        this.apiContext = apiContext
        this.loginPayload = loginPayload
    }

    async getAuthToken(){
        const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
        {data:this.loginPayload}
    )
    const loginResponseJson = await loginResponse.json() 
    let loginToken = loginResponseJson.token 
    // console.log('Login Token: '+loginToken)
    return loginToken
    }

    async createOrder(orderPayload){
         // Create Order API
            let response = {}
            response.token = await this.getAuthToken()

            const orderResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',{
                data:orderPayload,
                headers:{
                    'Authorization': response.token,
                    'Content-Type': 'application/json'
                }
            })
            const orderResponseJson = await orderResponse.json()
            console.log(orderResponseJson)
            const orderId = orderResponseJson.orders[0]
            response.orderId = orderId
            return response
        
        }

}
module.exports = {APIUtils}