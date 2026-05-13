const {test, expect} = require('@playwright/test');

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


 