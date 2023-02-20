export class project{
    user_id:number;
    start_index:number;
    count:number;
    project_name:string;
    project_id:string;
    folder_id:string;
    project_tag_name:string;
    project_tag_id:number;
    search_keyword:string;
    current_user_id:number;
    is_owner_flag:boolean;
    first_name:string;
    last_name:string;
    email_id:string;
    status:any;
    view_permission_flag:boolean;
	edit_permission_flag:boolean;
    admin_permission_flag:boolean;
    created_date:string;
    last_updated_date:string;
    sync_version_uuid:string;
    updated_by_userid:string;
}
export class Global{
    public static apiURL: string
}