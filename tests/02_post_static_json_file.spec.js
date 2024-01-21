const {test, expect} = require ('@playwright/test');
const bookingAPIRequestBody = require ('../test-data/post_request_body.json')

test ('Create POST api request using static JSON file', async({request})=>{

    const postAPIResponse = await request.post('/booking', {

        data: bookingAPIRequestBody
    });

    // Validate Status Code
    expect(postAPIResponse.status()).toBe(200);
    expect(postAPIResponse.ok()).toBeTruthy(); 

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    // Validate JSON API Response
    expect(postAPIResponseBody.booking).toHaveProperty("firstname", "Karl-Heinz");
    expect(postAPIResponseBody.booking).toHaveProperty("lastname", "Rumminigge");

    //Validate Nested JSON Objects
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01");   

})