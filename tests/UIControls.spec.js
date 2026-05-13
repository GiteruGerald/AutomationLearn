const {test, expect} = require('@playwright/test');

test.only('UI Controls', async ({page})=>{
    await page.goto(process.env.PRACTISE_WEB_URL)
    // const userName = page.locator('#username')
    const userName = page.getByRole('textbox', { name: 'Username:' })
    // const userPwd = page.locator('#password')
    const userPwd = page.getByRole('textbox', { name: 'Password:' })
    const radioBtn = page.locator('.radiotextsty').last()
    const userRole = page.getByRole('combobox')
    // const termsBox = page.getByRole('checkbox', { name: 'I Agree to the terms and' })
    const termsBox = page.locator('#terms')
    // await page.pause()
    // const userRole = page.locator('select.form-control')
    
    const signInBtn = page.getByRole('button', { name: 'Sign In' })
    
    await userName.fill(process.env.PRACTISE_UNAME)
    await userPwd.fill(process.env.PRACTISE_PWD)
    await radioBtn.click()
    // await page.pause()
    await page.locator('#okayBtn').click()
    await termsBox.click()
    
    await userRole.selectOption('consult')
    
    //assertion 
    console.log("Checking Radio Button: "+ await radioBtn.isChecked())
    console.log("Checking T&Cs box: "+ await termsBox.isChecked())
    await expect(radioBtn).toBeChecked()
    await expect(termsBox).toBeChecked()
    
    await termsBox.uncheck()
    console.log("Checking T&Cs box: "+ await termsBox.isChecked())
    expect( await termsBox.isChecked()).toBeFalsy()//opposite is toBetruthy
    
    // await signInBtn.click()

})