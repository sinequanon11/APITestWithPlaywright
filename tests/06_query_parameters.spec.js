const {test, expect} = require ('@playwright/test');
import {stringFormat} from '../utils/common'
const bookingAPIRequestBody = require ('../test-data/post_dynamic_request_body.json');

test ('Query parameters', async({request})=>{

    const dynamicRequestBody = stringFormat(JSON.stringify(bookingAPIRequestBody), "Franz","Beckenbauer","football")

    const postAPIResponse = await request.post('/booking', {

        data: JSON.parse(dynamicRequestBody)
    });

    // Validate Status Code
    expect(postAPIResponse.status()).toBe(200);
    expect(postAPIResponse.ok()).toBeTruthy(); 

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    const bId = postAPIResponseBody.bookingid;

    // Validate JSON API Response
    expect(postAPIResponseBody.booking).toHaveProperty("firstname", "Franz");
    expect(postAPIResponseBody.booking).toHaveProperty("lastname", "Beckenbauer");

    // Validate Nested JSON Objects
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01"); 

    console.log("========================================================================")
    
    //Get API Call
    const getAPIResponse = await request.get(`/booking/`,{
        params:{
            "firstname":"Franz",
            "lastname": "Beckenbauer"
        }

    });
    console.log(await getAPIResponse.json());

    // Validate Status Code
    expect(getAPIResponse.ok()).toBeTruthy();
    expect(getAPIResponse.status()).toBe(200);

})