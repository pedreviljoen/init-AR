/*
 *  the PostImage function provides the API functionality to POST an image to the Google Vission API 
 *  for processing
 * 
 * Params 
 * data: Base64 Encided Image
 * Returns
 * return: JSON response body, see https://cloud.google.com/vision/docs/request#json_response_format
 * 
 */

import constant from '../config/constant'

const API_KEY = constant.API_KEY
const BASE_URL = 'https://vision.googleapis.com/v1/images:annotate'

export function postImage(data) {
  
  return fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
}