const {test, expect} = require("@playwright/test");

test('Calendar validations',async({page})=>{
    await page.goto(process.env.CALENDARPRACTICE_URL)

    const monthNo = '7'
    const date = '6'
    const year = '2027'
    const expectedList = [monthNo, date, year]

    await page.locator('div.react-date-picker__inputGroup').click()
    await page.locator('.react-calendar__navigation__label').click()
    await page.locator('.react-calendar__navigation__label').click() 
    await page.getByText(year).click()
    await page.locator('.react-calendar__year-view__months__month').nth(Number(monthNo)-1).click() //we subtract -1 since array starts counting from 0 ie 0,1,2..
    await page.locator('//abbr[text()='+date+']').click()

    const inputs = await page.locator(".react-date-picker__inputGroup__input")
    for (let i = 0; i < expectedList.length ; i++){
        const value = await inputs.nth(i).inputValue()
        expect(value).toEqual(expectedList[i])
    }
    // await page.pause()
})