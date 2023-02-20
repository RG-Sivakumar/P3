import { StringNullableChain } from "lodash";

export class FormImport {
    constructor() {
        this.source_form_ids_sepearated_by_comma = [];
        this.user_id = 0;
        this.destination_project_id = "";
        this.destination_form_ids = [];
        this.created_date = "";
        this.last_updated_date = "";
        this.sync_version_uuid = "0";
        this.updated_by_userid = "";
    }
    hasValues(): boolean {
        return (this.source_form_ids_sepearated_by_comma.length == 0 || this.destination_form_ids.length == 0) ?
            false :
            true;

    }
    source_form_ids_sepearated_by_comma: string[];
    user_id: number;
    destination_project_id: string;
    destination_form_ids: string[];
    created_date:string;
    last_updated_date:string;
    sync_version_uuid:string;
    updated_by_userid:string;
}
