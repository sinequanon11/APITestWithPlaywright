const {test, expect} = require ('@playwright/test');
import {stringFormat} from '../utils/common'
const bookingAPIRequestBody = require ('../test-data/post_dynamic_request_body.json');

test ('Create POST api request using dynamic JSON file', async({request})=>{

    const dynamicRequetBody = stringFormat(JSON.stringify(bookingAPIRequestBody), "Franz","Beckenbauer","football")

    const postAPIResponse = await request.post('/booking', {

        data: JSON.parse(dynamicRequetBody)
    });

    // Validate Status Code
    expect(postAPIResponse.status()).toBe(200);
    expect(postAPIResponse.ok()).toBeTruthy(); 

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    // Validate JSON API Response
    expect(postAPIResponseBody.booking).toHaveProperty("firstname", "Franz");
    expect(postAPIResponseBody.booking).toHaveProperty("lastname", "Beckenbauer");

    //Validate Nested JSON Objects
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01");   

})