const { test, request, expect } = require("@playwright/test");
const { ApiUtils } = require("./assignment_utils/ApiUtils");

const SIX_EVENTS_RESPONSE = {
  data: [
    {
      id: 1,
      title: "Tech Summit 2025",
      category: "Conference",
      eventDate: "2025-06-01T10:00:00.000Z",
      venue: "HICC",
      city: "Hyderabad",
      price: "999",
      totalSeats: 200,
      availableSeats: 150,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 2,
      title: "Rock Night Live",
      category: "Concert",
      eventDate: "2025-06-05T18:00:00.000Z",
      venue: "Palace Grounds",
      city: "Bangalore",
      price: "1500",
      totalSeats: 500,
      availableSeats: 300,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 3,
      title: "IPL Finals",
      category: "Sports",
      eventDate: "2025-06-10T19:30:00.000Z",
      venue: "Chinnaswamy",
      city: "Bangalore",
      price: "2000",
      totalSeats: 800,
      availableSeats: 50,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 4,
      title: "UX Design Workshop",
      category: "Workshop",
      eventDate: "2025-06-15T09:00:00.000Z",
      venue: "WeWork",
      city: "Mumbai",
      price: "500",
      totalSeats: 50,
      availableSeats: 20,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 5,
      title: "Lollapalooza India",
      category: "Festival",
      eventDate: "2025-06-20T12:00:00.000Z",
      venue: "Mahalaxmi Racecourse",
      city: "Mumbai",
      price: "3000",
      totalSeats: 5000,
      availableSeats: 2000,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 6,
      title: "AI & ML Expo",
      category: "Conference",
      eventDate: "2025-06-25T10:00:00.000Z",
      venue: "Bangalore International Exhibition Centre",
      city: "Bangalore",
      price: "750",
      totalSeats: 300,
      availableSeats: 180,
      imageUrl: null,
      isStatic: false,
    },
  ],
  pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};

const FOUR_EVENTS_RESPONSE = {
  data: [
    {
      id: 1,
      title: "Tech Summit 2025",
      category: "Conference",
      eventDate: "2025-06-01T10:00:00.000Z",
      venue: "HICC",
      city: "Hyderabad",
      price: "999",
      totalSeats: 200,
      availableSeats: 150,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 2,
      title: "Rock Night Live",
      category: "Concert",
      eventDate: "2025-06-05T18:00:00.000Z",
      venue: "Palace Grounds",
      city: "Bangalore",
      price: "1500",
      totalSeats: 500,
      availableSeats: 300,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 3,
      title: "IPL Finals",
      category: "Sports",
      eventDate: "2025-06-10T19:30:00.000Z",
      venue: "Chinnaswamy",
      city: "Bangalore",
      price: "2000",
      totalSeats: 800,
      availableSeats: 50,
      imageUrl: null,
      isStatic: false,
    },
    {
      id: 4,
      title: "UX Design Workshop",
      category: "Workshop",
      eventDate: "2025-06-15T09:00:00.000Z",
      venue: "WeWork",
      city: "Mumbai",
      price: "500",
      totalSeats: 50,
      availableSeats: 20,
      imageUrl: null,
      isStatic: false,
    },
  ],
  pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};

const loginPayload = {
  email: process.env.EVENTSHUB_USERNAME,
  password: process.env.EVENTSHUB_PWD,
};
let authToken;
test.beforeAll(async ({}) => {
  const apiContext = await request.newContext();
  const apiUtils = new ApiUtils(apiContext, loginPayload);
  authToken = await apiUtils.getAuthToken();
});

test("Banner IS visible when 6 events are returned", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("eventhub_token", value);
  }, authToken);
  await page.goto(process.env.EVENTSHUB_URL);

  await page.route("**/api/events**", async (route) => {
    let realResponse = await page.request.fetch(route.request());
    let sixEventsBody = JSON.stringify(SIX_EVENTS_RESPONSE);

    route.fulfill({
      contentType: "application/json",
      body: sixEventsBody,
      status: 200,
    });
  });

  await page.getByRole("link", { name: "Browse Events →" }).click();
  await page.waitForResponse("**/api/events**");

  //Verify cards loaded from mock
  const eventCards = await page.locator("[data-testid*='event-card']");
  await expect(eventCards.first()).toBeVisible();
  await expect(eventCards).toHaveCount(6);

  // Verify banner is visible
  await expect(
    page.getByText("Your sandbox holds up to ", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("Your sandbox holds up to")).toContainText(
    "9 bookings",
  );
});

test("Banner is NOT visible when 4 events are returned", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("eventhub_token", value);
  }, authToken);

  await page.goto(process.env.EVENTSHUB_URL);

  await page.route("**/api/events**", async (route) => {
    let realResponse = await page.request.fetch(route.request());
    let fourEventsBody = JSON.stringify(FOUR_EVENTS_RESPONSE);

    route.fulfill({
      contentType: "text/plain",
      status: 200,
      body: fourEventsBody,
    });
  });
});
