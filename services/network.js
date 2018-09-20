import { postImage } from './api'
import {processData} from './process/process-data'

export async function obtainResults(base = ''){
  const imageRequest = {
    requests: [
      {
        image: {
          content: base
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 4
          },
          {
            type: "WEB_DETECTION",
            maxResults: 4
          }
        ]
      }
    ]
  }
  //
  const result = await postImage(imageRequest)
  const item = processData(result)
  return item
}
