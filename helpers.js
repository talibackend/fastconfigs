const ObjectTraverser = (object, path)=>{
    let return_value = object;
    if(path.length > 0){
        for(let i = 0; i < path.length; i++){
            let current_path = path[i];
            
            if(!current_path.actions){
                return_value = return_value[`${current_path.key}`];
            }else{
                let current_processed_value = return_value[`${current_path.key}`];
                for(let j = 0; j < current_path.actions.length; j++){
                    switch(current_path.actions[j]){
                        case 'json_parse':
                            current_processed_value = JSON.parse(current_processed_value);
                            break;
                        default:
                            break;
                    }
                }
                return_value = current_processed_value;
            }
        }
    }
    return return_value;
}

const ReplaceObjectValues = (object, pair)=>{
    let keys = Object.keys(object);

    for(let i = 0; i < keys.length; i++){
        let current_key = keys[i];
        if(typeof(object[`${current_key}`]) == "object"){
            object[`${current_key}`] = ReplaceObjectValues(object[`${current_key}`], search, value);
        }else{
            let pair_keys = Object.keys(pair);
            for(let j = 0; j < pair_keys.length; j++){
                let current_pair_key = pair_keys[j];
                object[`${current_key}`] = object[`${current_key}`].replaceAll(current_pair_key, pair[`${current_pair_key}`]);
            }
        }
    }

    return object;
}