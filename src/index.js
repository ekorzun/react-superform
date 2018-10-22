import React from 'react'
import SuperForm from './lib/SuperForm'

export {
  SuperForm,
  SuperForm as default
}


// class x extends {
//   render(){
//     return (
//         <Form
//           value={this.props.item}
//           defaultValue={this.props.item}
//           onCancel={this.handleCancel}
//           onChange={this.handleChange}
//           onSubmit={this.handleChange}
//           onError={this.handleError}
//           validateOn={`submit|change|null`}
//           validate={f => f}
//            plugins={[]}
//           errors={{
//             name: `msg`
//           }}
//           isDisabled
//           isBusy
//           className
//           schema
//           theme={{
//             container: '',
//             row: '',
//             label: '',
//             input: '',
//             header: '',
//             footer: '',
//             body: '',
            
//             labelInvalid: '',
//             rowInvalid: '',
//             inputInvalid: '',
            
//             labelFosuced: '',
//             rowFosuced: '',
//             inputFosuced: '',
//           }}
//           layout={[

//           ]}
//           renderer
//           model
//           Header='?'
//         />
//     )
//   }
// }