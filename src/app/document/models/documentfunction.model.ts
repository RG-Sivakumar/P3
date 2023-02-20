export class documentfunction_maintain {
    
    constructor(){}

    public layer_data_update(layer_data,push_annotation_value){
        if(layer_data!=undefined){
            let find_layer = layer_data.findIndex((l_data)=>l_data.layer_id==push_annotation_value.layer_id);
            if(find_layer > -1){
                let find_annot = layer_data[find_layer].annotations.findIndex((a_data)=>a_data.annotation_id==push_annotation_value.annotation_id);
                if(find_annot > -1){
                    layer_data[find_layer].annotations.splice(find_annot,1,push_annotation_value);
                }
            }
        }
        return layer_data;
    }
}