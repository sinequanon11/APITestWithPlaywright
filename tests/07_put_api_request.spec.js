const {test, expect} = require ('@playwright/test');
import {stringFormat} from '../utils/common'
const bookingAPIRequestBody = require ('../test-data/post_dynamic_request_body.json');

test ('Create PUT api request', async({request})=>{

    const dynamicRequestBody = stringFormat(JSON.stringify(bookingAPIRequestBody), "Franz","Beckenbauer","football")

    console.log("====== POST API =======")

    const postAPIResponse = await request.post('/booking', {

        data: JSON.parse(dynamicRequestBody)
    });

    // Validate Status Code
    expect(postAPIResponse.status()).toBe(200);
    expect(postAPIResponse.ok()).toBeTruthy(); 

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    const bId = postAPIResponseBody.bookingid;

    const tokenRequestBody = require('../test-data/token_request_body.json')
    const putRequestBody = require('../test-data/put_request_body.json')

    // Validate JSON API Response
    expect(postAPIResponseBody.booking).toHaveProperty("firstname", "Franz");
    expect(postAPIResponseBody.booking).toHaveProperty("lastname", "Beckenbauer");

    // Validate Nested JSON Objects
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkin", "2018-01-01");
    expect(postAPIResponseBody.booking.bookingdates).toHaveProperty("checkout", "2019-01-01"); 

    console.log("====== GET API =======")
    
    //Get API Call
    const getAPIResponse = await request.get(`/booking/${bId}`);
    console.log(await getAPIResponse.json());

    // Validate Status Code
    expect(getAPIResponse.ok()).toBeTruthy();
    expect(getAPIResponse.status()).toBe(200);

    // Generate Token

    const tokenResponse = await request.post(`/auth`, {
        data: tokenRequestBody
    })

    const tokenAPIResponseBody = await tokenResponse.json();
    const tokenNo = tokenAPIResponseBody.token;
    console.log("Token no is: " + tokenNo)

    console.log("====== PUT API =======")

    // PUT Api Call
    const putResponse = await request.put(`/booking/${bId}`, {
        headers:{
            "Content-Type":"application/json",
            "Cookie":`token=${tokenNo}`
        },
        data: putRequestBody
    })

    const putResponseBody = await putResponse.json();
    console.log(putResponseBody)

    // Validate status code

    expect(putResponse.status()).toBe(200);


})