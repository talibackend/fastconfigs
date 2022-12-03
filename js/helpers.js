const SupportedPlatforms = {
    heroku : {
        name : "Heroku",
        login_redirect : "https://dashboard.heroku.com/",
        dashboard : "https://dashboard.heroku.com/",
        success_redirect_url : "https://dashboard.heroku.com/apps/fastconfigs-app-id/settings",
        auth : {
            type : "local_storage",
            path : [
                {
                    key : "ember_simple_auth-session",
                    actions : ["json_parse"],
                    type : "string"
                },
                {
                    key : "authenticated",
                    action : null,
                    type : "object"
                },
                {
                    key : "access_token",
                    action : null,
                    type : "string"
                }
            ],
        },
        fetch_app_response : {
            path : [],
            name_path : [
                {
                    key : "name",
                    actions : null,
                    type : "string"
                }
            ],
            id_path : [
                {
                    key : "id",
                    actions : null,
                    type : "string"
                }
            ]
        },
        fetch_apps_payload : {
            url : "https://api.heroku.com/users/~/apps",
            method : "GET",
            headers : {
                authorization : `Bearer fastconfigs-auth-token`,
                accept: 'application/vnd.heroku+json; version=3.cedar-acm'
            }
        },
        fetch_former_env_payload : null,
        fetch_former_env_response : null,
        // fetch_former_env_response : {
        //     path : []
        // },
        // fetch_former_env_payload : {
        //     url : "https://api.heroku.com/apps/fastconfigs-app-id/config-vars",
        //     method : "GET",
        //     headers : {
        //         authorization : `Bearer fastconfigs-auth-token`,
        //         accept: 'application/vnd.heroku+json; version=3.cedar-acm',
        //         "Content-Type": "application/json"
        //     },
        //     body : null
        // },
        configure_app_env_request : {
            type : "object",
            path : []
        },
        configure_app_env_payload : {
            url : "https://api.heroku.com/apps/fastconfigs-app-id/config-vars",
            method : "PATCH",
            headers : {
                authorization : `Bearer fastconfigs-auth-token`,
                accept: 'application/vnd.heroku+json; version=3.cedar-acm',
                "Content-Type": "application/json"
            }
        }
    },
    netlify : {
        name : "Netlify",
        login_redirect : "https://app.netlify.com/",
        dashboard : "https://app.netlify.com/",
        success_redirect_url : "https://app.netlify.com/sites/fastconfigs-app-name/settings/deploys",
        auth : null,
        fetch_app_response : {
            path : [],
            name_path : [
                {
                    key : "name",
                    actions : null,
                    type : "string"
                }
            ],
            id_path : [
                {
                    key : "id",
                    actions : null,
                    type : "string"
                }
            ]
        },
        fetch_apps_payload : {
            url : "https://app.netlify.com/access-control/bb-api/api/v1/sites?filter=all",
            method : "GET",
            headers : null
        },
        fetch_former_env_response : {
            path : [
                {
                    key : "build_settings",
                    actions : null,
                    type : "object"
                },
                {
                    key : "env",
                    actions : null,
                    type : "object"
                }
            ]
        },
        fetch_former_env_payload : {
            url : "https://app.netlify.com/access-control/bb-api/api/v1/sites/fastconfigs-app-id",
            method : "GET",
            headers : null,
            body : null
        },
        configure_app_env_request : {
            type : "object",
            path : [
                {
                    key : "build_settings",
                    actions : null,
                    type : "object"
                },
                {
                    key : "env",
                    actions : null,
                    type : "object"
                }
            ]
        },
        configure_app_env_payload : {
            url : "https://app.netlify.com/access-control/bb-api/api/v1/sites/fastconfigs-app-id",
            method : "PUT",
            headers : {
                "content-type": "application/json"
            },
        }
    },
    // vercel : {
    //     name : "Vercel",
    //     login_redirect : "https://vercel.com/dashboard/",
    //     dashboard : "https://vercel.com/dashboard/",
    //     success_redirect_url : null,
    //     auth : null,
    //     fetch_app_response : {
    //         path : [],
    //         name_path : [
    //             {
    //                 key : "name",
    //                 actions : null,
    //                 type : "string"
    //             }
    //         ],
    //         id_path : [
    //             {
    //                 key : "id",
    //                 actions : null,
    //                 type : "string"
    //             }
    //         ]
    //     },
    //     fetch_apps_payload : {
    //         url : "https://vercel.com/api/v2/projects/?limit=all&latestDeployments=0&excludeRepos=__placeholder__",
    //         method : "GET",
    //         headers : null
    //     },
    //     fetch_former_env_response : null,
    //     fetch_former_env_payload : null,
    //     configure_app_env_request : {
    //         type : "array",
    //         path : [],
    //         each_env_prototype : '{"type" : "encrypted", "key" : "fastconfigs-key", "value" : "fastconfigs-value", "target" : ["development", "production", "preview"]}'
    //     },
    //     configure_app_env_payload : {
    //         url : "https://vercel.com/api/v10/projects/fastconfigs-app-id/env",
    //         method : "PUT",
    //         headers : {
    //             "content-type" : "application/json; charset=utf-8"
    //         },
    //         body : null
    //     }
    // }
}


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

let CreateObjectFromPath = (path, value)=>{
    let return_value = value;
    if(path.length > 0){
        return_value = {};

        for(let i = 0; i < path.length; i++){
            if(Object.keys(return_value).length < 1){
                return_value[`${path[i].key}`] = value;
            }else{
                let last_key = Object.keys(return_value)[Object.keys(return_value).length - 1];
                path.shift();
                return_value[`${last_key}`] = CreateObjectFromPath(path, value);
            }
        }
    }
    return return_value;
}
