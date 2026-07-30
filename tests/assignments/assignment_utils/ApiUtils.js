class ApiUtils{

    constructor(apiContext, loginPayload){
        this.apiContext = apiContext
        this.loginPayload = loginPayload
    }

    async getAuthToken(){
        const loginResponse = await this.apiContext.post(
            'https://api.eventhub.rahulshettyacademy.com/api/auth/login',
            {data:this.loginPayload}
        )
        const loginResponseJson = await loginResponse.json()
        let authToken = loginResponseJson.token
        return authToken
    }

}
module.exports = {ApiUtils}
