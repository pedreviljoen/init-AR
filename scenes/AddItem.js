'use strict'
import React, { Component } from 'react'
import {
  ViroARScene,
  ViroText,
  ViroARPlaneSelector,
  ViroBox,
  ViroNode,
  ViroMaterials,
  Viro3DObject,
  ViroAnimations
} from 'react-viro'
// services import
import { obtainResults } from '../services/network'
//dependancies import
import colors from '../config/colors'
import objs from '../config/objs'

export default class AddItem extends Component {

  constructor() {
    super();

    // Set initial state
    this.state = {
      position: [],
      anchorId: '',
      index: 0,
      planeSelected: false,
      processingStatus: false,
      GooglVisResult: '',
      dragging: true,
      base64: ''
    };
  }

  componentWillMount = async () => {
    this.setState({
      position: [],
      index: 0,
    })
  }
  
  render() {
    this._doGv()
    return (
      <ViroARScene>
        <ViroARPlaneSelector minHeight={.006} minWidth={.006} 
          onPlaneSelected={(dataIn) => {this.setState({index: 1, position: dataIn.position})}}
          ref={(PlaneRef) => { this._planeRef = PlaneRef}}
          >
        </ViroARPlaneSelector>
        {this._renderIndex()}
      </ViroARScene>
    )
  }

  // The Render Index function, rendering visuals based on the state of the product-addition flow
  _renderIndex = () => {
    switch (this.state.index) {
      case 1:
      return(
        <ViroBox
          dragType="FixedToWorld" 
          onDrag={(dragToPos)=>{
            this.setState({dragging: true, position: dragToPos})
          }}
          materials={["camera"]}
          position={this.state.position}
          height={0.1}
          width={0.1}
          length={0.1}
          onClickState={(stateValue) => {
            if(stateValue == 1) {
              this.setState({dragging: false})
            } else if(stateValue == 3 && !this.state.dragging) { 
              this.setState({index: 2})
            }
          }}
          />)
      break

      // case 2 renders nothing, since this is where the screenshot is taken that is sent to Google Vision for identification. No visual is rendered to ensure a 
      // clean image be sent to GV. After the screenshot is taken, the image is processed while index 3 is rendered.

      case 3:
       /*
        * TODO: 
        * Visualise an object to render while the GoogleVision results are being processed. This can be a 3D object, text, animation, etc. 
        * Case 3 is automatically render and removed by the existing GV functionality. For documentation on rendering 3D objects see: 
        *   Viro 3DObject: https://docs.viromedia.com/docs/3d-objects 
        */
      return(
        <ViroNode
        position={this.state.position} 
        >
          <Viro3DObject
          source={objs.loading}
          materials={["loading"]}
          position={[0,0,0]}
          scale={[.05, .05, .05]}
          color={colors.red}
          rotation={[90,0,0]}
          animation={{name:'loopRotate', run:true, loop:true}}
          type="OBJ" />
        </ViroNode>
        )
      break

      case 4:
      /*
        * TODO: 
        * Create Augmented Reality UI objects that provides the user with the Google Vission result, and requires of him to confirm/reject
        * the result processed by the GV Result process you built. Include the following elements in your solution to conform to the existing flow: 
        * 
        * RESULT
        * The GV result that should be displayed is contained in {this.state.GooglVisResult}, as obtained from the obtainResults() function
        * 
        * CONFIRM RESULT
        * The following functionality should be triggered when the user agrees with the result returned, and would like to add it to the basket:
          onClick={() => {
            this.props.arSceneNavigator.viroAppProps.f_confirmItem(this.state.GooglVisResult, this.state.position) 
            this.setState({index: 5})
            }
          }
        *  
        * REJECT RESULT
        * The following functionality should be triggered when the user dissagrees with the result returned, and would like to restart the addItem flow:
          onClick={() => {
            this._resetView()}
          }
        */
      return(
        <ViroNode
        position={this.state.position} 
        >
          <Viro3DObject
          source={objs.sphere}
          materials={["yes"]}
          position={[0.07,0.14,0]} 
          scale={[.012, .012, .012]} 
          //animation={{name:'buttonAppear', run:true}} 
          onClick={() => {this.props.arSceneNavigator.viroAppProps.f_confirmItem(this.state.GooglVisResult, this.state.position) 
            this.setState({index: 5})}
          }
          type="OBJ" />
          
          <Viro3DObject
          source={objs.square}
          materials={["no"]}
          position={[-0.07,0.14,0]} 
          scale={[.00001, .00001, .00001]} 
          animation={{name:'buttonAppear', run:true}} 
          onClick={() => {
            this._resetView()}
          }
          type="OBJ" />

          <ViroText 
          text={`Is this ${this.state.GooglVisResult}?`}
          position={[0,0.02,0]} 
          scale={[.12, .12, .12]} 
          style={{fontFamily:"Arial", fontSize:70, fontWeight:'400', color: colors.white, textAlignVertical: 'center', textAlign: 'center'}} 
          extrusionDepth={5} 
          width={15} height={2}/>
        </ViroNode>
        )
      break

      case 5:
      return(
        <ViroBox
          materials={["done"]}
          position={this.state.position}
          animation={{name:'loopRotateAll', run:true, loop:true}}
          height={0.1}
          width={0.1}
          length={0.1}
          onClick={() => {this._resetView()}}
          />)
      break

      default:
        return(null)
    }
  }

  // Functions relating to the Google Vision image recognition. CSwitch is called upon every re-render of the AddItem scene
  _doGv = async () => {
    switch (this.state.index) {

      // Take screenshot and do base64 encoding. Returns base64 encoded image
      case 2:
        await setTimeout(() => {console.log('[BASE64] START')}, 150)
        const base64 = await this.props.arSceneNavigator.viroAppProps.f_takePhoto()
        console.log('[BASE64] DONE')
        this.setState({index: 3, base64: base64})
      break

      // Find a match for the item captured. Uploads the image to Google Vision, and attempts to find a product-match from the JSON response URL
      case 3:
      const result = await obtainResults(this.state.base64)
      console.log('GV: ', result)
      this.setState({index: 4, GooglVisResult: result})
      break

      default:
        null
      break
  
    } 
  }

  // Resets the AddItem screen after a product-add flow is completed
  _resetView = () => {
    this.setState({position: [],index: 0, GooglVisResult: ''})
    this._planeRef.reset()
    this.props.arSceneNavigator.viroAppProps.f_pauseAddition()
  }

}

// Viro Materials created to use in the 3D objects
ViroMaterials.createMaterials({
  camera: {
    diffuseTexture: require('../assets/materials/device-camera-icon.png'),
  },
  done: {
    diffuseTexture: require('../assets/materials/done_img.png'),
  },
  loading: {
    diffuseColor: colors.cardGrey,
  },
  yes: {
    diffuseColor: colors.green,
  },
  no: {
    diffuseColor: colors.red,
  },
})

// Viro Animations created for use in the 3D objects
ViroAnimations.registerAnimations({
  loopRotate:{properties:{rotateZ:"+=45"}, duration:650},
  loopRotateAll:{properties:{rotateY:"+=45",rotateX:"+=45"}, duration:1000},
  buttonAppear:{properties:{scaleX:0.017, scaleY:0.017, scaleZ:0.017, opacity: 1},  
                easing:"EaseOut", duration: 700},
})


module.exports = AddItem