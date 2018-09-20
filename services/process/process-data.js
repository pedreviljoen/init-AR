 /*
 * TODO: Build the processData function that can processes the Google Vission response body, to determine what the identified food type is. 
 * The JSON response body is returned from the Google Vission API, as provided by the postImage() function ('/services/api.js'). A screenshot 
 * is taken of the product during the addItem flow, which is then sent to the postImage() function. 
 * 
 * For more info on the JSON response body, see https://cloud.google.com/vision/docs/request#json_response_format
 * 
 * Params 
 * data: Google Vission JSON response body
 * Returns
 * return: String, representing the food type identified
 * 
 */
import preset from './preset-data'

export function processData(data = {}){
  /*
  Responses has the following structure, each field is subject to availability and needs to be checked:

  - responses = {
    fullTextAnnotation: {
      pages: [

      ],
      text: String
    },
    textAnnotations: [
      {
        locale: String,
        description: String,
        boundingPoly: Object -> contains coords surrounding the text
      }
    ],
    webDetection: {
      bestGuessLabels:        List[Object] -> describes best possible label description of image,
      visuallySimilarImages:  List[Object] -> url's with similar images,
      webEntities: [
        {
          entityId: String,   
          score: Double,        -> Provides probability that the description matches
          description: String   -> Description of image
        }
      ]
    }
  }
  */
  const responses = data.responses[0]
  const result = 'Not Found'

  if(responses.webDetection.webEntities){
    console.log('Web entities available')
    const entities = responses.webDetection.webEntities

    const f = entities.filter(entity => {
      const description = entity.description.toLowerCase()
      return preset.includes(description)
    })

    if(f.length > 0){
      return f[0].description
    }
  }

  if(responses.textAnnotations){
    console.log('Text annotations available')
    const textData = responses.textAnnotations.slice(1)

    const f = textData.filter(text => {
      const description = text.description.toLowerCase()
      return preset.includes(description)
    })

    if (f.length > 0) {
      return f[0].description
    }
  }

  return result
}