const {test, expect} = require ('@playwright/test');
import {faker} from '@faker-js/faker';
const {DateTime} = require('luxon');

test ('Create POST api request using dynamic request body', async({request})=>{

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const totalPrice = faker.number.int(1000, 3000);

    const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
    const checkOutDate = DateTime.now().plus({day:7}).toFormat('yyyy-MM-dd');

    const postAPIResponse = await request.post('/booking', {

        data: {

            "firstname": firstName,
            "lastname": lastName,
            "totalprice": totalPrice,
            "depositpaid": true,
            "bookingdates": {
                "checkin": checkInDate,
                "checkout": checkOutDate
            },
            "additionalneeds": "super bowls"
        }
    });

    // Validate Status Code
    expect(postAPIResponse.status()).toBe(200);
    expect(postAPIResponse.ok()).toBeTruthy(); 

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    // Validate JSON API Response
    expect(postAPIResponseBody.booking).toHaveProperty("firstname", firstName);
    expect(postAPIResponseBody.booking).toHaveProperty("lastname", lastName);

    //Validate Nested JSON Objects
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkin", checkInDate);
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkout", checkOutDate);   

})