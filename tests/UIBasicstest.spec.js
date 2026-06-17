const {test, expect} = require('@playwright/test');

test.describe('Handling UI Components', ()=>{
    
    test('Browser Context Playwright test', async ({browser})=>
        {
            //create fresh(new) instance of broswer- Context defaults
            const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto("https://google.com")
        
        console.log (await page.title())

        
});

test ('Page Playwright test', async ({page})=>
{
    
    
    await page.goto(process.env.WEBSITE_URL)
    //get title - assertion
    
    console.log (await page.title())
    await expect(page).toHaveTitle("Signin | Diamond Trust Bank Kenya")
    //css,  type, fill
    await page.locator('[type="text"]').fill(process.env.UNAME)
    
    await page.locator('[type="password"]').fill(process.env.PWD)
    
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // await page.pause()
    const cardTitles = page.locator(".operation-font")
    // console.log(await cardTitles.first().textContent()) // has wait time till element found
    
    // await page.waitForLoadState('networkidle') // refer to documentation, its a bit flaky(doesnt work all the time)
    await cardTitles.last().waitFor()
    const allTitles = await cardTitles.allTextContents() // does not wait to find element. can return empty array if page load is too fast; use NetworkIdle(discouraged) or Waitfor on element(singular element) to counter this
    // console.log(title)
    console.log(allTitles)
    // await cardTitles.nth(1).click() // second title
    // await page.pause()
    
    //Incase of invalid logins
    // console.log(await page.locator('.a-Notification-item').textContent())
    // await page.getByRole('heading', { name: 'Invalid username' })
    // await page.getByRole('heading', { name: 'Invalid password' })
    // console.log(await page.locator('.bold-error-message').textContent())
    // await expect(page.locator('.bold-error-message')).toContainText('Invalid')
    // await expect(page.locator('.a-Notification-item')).toContainText('Invalid')

    
});

test('UI Controls', async ({page})=>{
    await page.goto(process.env.PRACTISE_WEB_URL)
    // const userName = page.locator('#username')
    const userName = page.getByRole('textbox', { name: 'Username:' })
    // const userPwd = page.locator('#password')
    const userPwd = page.getByRole('textbox', { name: 'Password:' })
    const radioBtn = page.locator('.radiotextsty').last()
    const userRole = page.getByRole('combobox')
    const docLink = page.locator("[href*='documents-request']")
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
    console.log("Checking T&Cs box before: "+ await termsBox.isChecked())
    await expect(radioBtn).toBeChecked()
    await expect(termsBox).toBeChecked()
    
    await termsBox.uncheck()
    console.log("Checking T&Cs box after: "+ await termsBox.isChecked())
    expect( await termsBox.isChecked()).toBeFalsy()//opposite is toBetruthy
    
    // await signInBtn.click()

    // await page.pause()
    await expect(docLink).toHaveAttribute("class","blinkingText") 
    // await page.pause()
});

test('Child windows handler', async ({ browser }) => {
  //create fresh(new) instance of broswer- Context defaults
  const context = await browser.newContext()
  const page = await context.newPage()
  const userName = page.getByRole('textbox', { name: 'Username:' })

  await page.goto(process.env.PRACTISE_WEB_URL)
  const docLink = page.locator("[href*='documents-request']")

  const [newPage] = await Promise.all([
    context.waitForEvent('page'), //listener for any new page pending, rejected, fulfilled
  docLink.click()
  ]) //new page is opened

  const newPageText = await newPage.locator(".red").textContent();
  const arrayText = newPageText.split("@")
  const domain = arrayText[1].split(" ")[0]
  console.log(domain)

  await userName.fill(domain)
  console.log("Usenamevalue on 1st page: "+await userName.inputValue()) //textContent returns value attached in DOM at initial load

    });

});
