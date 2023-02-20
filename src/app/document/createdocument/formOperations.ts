import * as _ from 'lodash';


export function getCurrentForm(LayersData, annotation_id, index = 0) {
  let forms = getformsList(LayersData, annotation_id);
  for (var j = 0; j < forms.length; j++) {
    if (forms != []) {
      return forms[forms.length-1].form_data;
    }
  }
}

function getformsList(LayersData, annotation_id) {
  
  if (LayersData != undefined) {
    for (var i = 0; i < LayersData.length; i++) {
      for (var j = 0; j < LayersData[i].annotations.length; j++) {
        if (annotation_id == LayersData[i].annotations[j].annotation_id) {
          return LayersData[i].annotations[j].annotation_forms;
        }
      }
    }
  }
}

export function Addform(LayersData, FormData, annotation_id) {
  if (LayersData != undefined) {
    for (var i = 0; i < LayersData.length; i++) {
      for (var j = 0; j < LayersData[i].annotations.length; j++) {
        if (annotation_id == LayersData[i].annotations[j].annotation_id) {
          let isDataExits = LayersData[i].annotations[j].annotation_forms.some((data) => data.form_id == FormData.form_id);
          console.log(isDataExits);
          if(isDataExits != true){
            LayersData[i].annotations[j].annotation_forms.push(FormData)
          }
        }
      }
    }
  }
  return LayersData;
}

export function getFormById(LayersData, annotation_id, form_id) {
  let formsList = getformsList(LayersData, annotation_id);
  let forms = formsList.find((s) => s.form_id == form_id);
  return forms.form_data;
}

export function ext_getFormById(LayersData, annotation_id, form_id) {
  let formsList = getformsList(LayersData, annotation_id);
  let forms = formsList.find((s) => s.form_id == form_id);
  return forms.ext_form_data;
}
export function getFormBy_Id(LayersData, annotation_id, form_id) {
  let formsList = getformsList(LayersData, annotation_id);
  let forms = formsList.find((s) => s.form_id == form_id);
  return forms;
}
export function getmediaList(LayersData, annotation_id) {
  if (LayersData != undefined) {
    for (var i = 0; i < LayersData.length; i++) {
      for (var j = 0; j < LayersData[i].annotations.length; j++) {
        if (annotation_id == LayersData[i].annotations[j].annotation_id) {
          return LayersData[i].annotations[j].annotation_media;
        }
      }
    }
  }
}
export function getStubList(LayersData, annotation_id) {
  if (LayersData != undefined) {
    for (var i = 0; i < LayersData.length; i++) {
      for (var j = 0; j < LayersData[i].annotations.length; j++) {
        if (annotation_id == LayersData[i].annotations[j].annotation_id) {
          return LayersData[i].annotations[j].annotation_stubs;
        }
      }
    }
  }
}


export function layer_mapping_copy_btw_doc(layerdata, selected_annotations) {
  // mapping the layer for localstorage
  let cloneLayerData = _.cloneDeep(layerdata);
  let deleteAnnotation = _.cloneDeep(selected_annotations);
  let currentLayers = [];
  let existLayer = [];
  for (let a = 0; a < cloneLayerData.length; a++) {
    cloneLayerData[a].annotations = [];
  }
  for (let km = 0; km < deleteAnnotation.length; km++) {
    let findLyaerIndex = cloneLayerData.findIndex((Ldata) => Ldata.layer_id == deleteAnnotation[km].layer_id);
    if (findLyaerIndex > -1) {
      let pushItem = cloneLayerData[findLyaerIndex];
      if (existLayer.some((data1) => data1 == deleteAnnotation[km].layer_id)) {
        let existLayerFindIndex = currentLayers.findIndex((Edata) => Edata.layer_id === pushItem.layer_id);
        if (existLayerFindIndex > -1) {
          currentLayers[existLayerFindIndex].annotations.push(deleteAnnotation[km]);
        }
      }
      else {
        existLayer.push(cloneLayerData[findLyaerIndex].layer_id);
        cloneLayerData[findLyaerIndex].annotations.push(deleteAnnotation[km]);
        currentLayers.push(cloneLayerData[findLyaerIndex]);
      }
    }
  } 
  return cloneLayerData;
  
}

