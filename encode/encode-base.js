// import RNFS from'react-native-fs'

// export async function encode64(uri = ''){
//   RNFS.readFile(uri, 'base64').then((value) => {
//     return value
//   }).catch((err) => {
//     return 'Error'
//   })
// }

import { ImageEditor, ImageStore, Image } from 'react-native'

export async function encode64(uri = '') {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => {
      const cropData = {
        offset: {x: 0, y: 0},
        size: {width: width, height: height}
      }
  
      ImageEditor.cropImage(uri, cropData, (uri) => {
        ImageStore.getBase64ForTag(uri, (base64) => {
          resolve(base64)
        }, reject)
      }, reject)
    }, reject)
  })

}