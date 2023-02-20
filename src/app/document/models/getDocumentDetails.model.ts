export class getDocumentDetails {
  user_id: number;
  project_id: string;
  folder_id: string;
  document_id: string;
  page_id: string;
  rename_page: string;
  layer_page_tag_name: string;
  layer_page_tag_id: Number;
  last_updated_date:any;
  created_date:any;
  sync_version_uuid:any;
  updated_by_userid:string;
  p3_project_id:string;
  is_project:boolean;
  process_id:string;
  request_id:string;
}

export class exportCSV{
  email_id:string;
  project_id:string;
  document_id:string;
  page_id:string;
  export_type:string;
  is_link:string;
}

export class pdfExport{
  email_id:string;
  project_id:string;
  document_id:string;
  page_id:string;
  export_type:string;
  is_link:boolean;
}
