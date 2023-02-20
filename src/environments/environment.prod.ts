export const environment = {
  production: true,
  //dev
  // APIBaseUrl: "https://devapi.plannotate3.com:3002/planotate30/api/v2/",
  // iPadDownloadUrl: "https://plannotate3ipadbuild.s3.amazonaws.com/iPadDevBuild/manifest.plist",
  //qa
   APIBaseUrl: "https://qaapi.plannotate3.com:3002/planotate30/api/v2/",
   iPadDownloadUrl: "https://plannotate3ipadbuild.s3.amazonaws.com/IpadBuildQA/manifest.plist",
  //live   
  // APIBaseUrl: "https://api.plannotate3.com:3002/planotate30/api/v2/",
  // iPadDownloadUrl: "https://plannotate3ipadbuild.s3.amazonaws.com/Ipad-Build/manifest.plist",
  //EXPORT (For Live Server)
  // APIExportUrl:"https://extapi.plannotate3.com:3002/plannotate30/filemanager/api/v1/"

  //Export (For QA Server)
  //  APIExportUrl:"http://34.204.43.233:3002/plannotate30/filemanager/api/v1/" old
    APIExportUrl:"https://devapi.plannotate3.com:3002/plannotate30/filemanager/api/v1/"
};