function getBaseUrl() {
    const environment = import.meta.env.VITE_APP_ENVIRONMENT || "local";
    try {
      switch (environment) {
        case "local":
          return import.meta.env.VITE_APP_LOCAL_API_URL;
        case "production":
          return import.meta.env.VITE_APP_PRODUCTION_API_URL;
        case "staging":
          return import.meta.env.VITE_APP_STAGING_API_URL;
        default:
          throw new Error(`Invalid environment: ${environment}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // function getBaseUrl(){
  //   return import.meta.env.VITE_APP_LOCAL_API_URL;
  // }

  export const baseurl = getBaseUrl();
export const apis = {
    // Auth
    BASE_URL: baseurl,
  SIGN_UP: `${baseurl}/api/user/signUp`,
  LOGIN: `${baseurl}/api/user/login`,
  GETALLMESSAGES: `${baseurl}/api/userMessage/getAllMessages`,
  CREATMESSAGE: `${baseurl}/api/userMessage/createMessage`,
  UPDATEMESSAGE: `${baseurl}/api/userMessage/updateMessages`,
  DELETEMESSAGE: `${baseurl}/api/userMessage/deleteMessages`,
  AUDIOMESSAGE: `${baseurl}/api/userMessage/audio`,
  IMAGEMESSAGE: `${baseurl}/api/userMessage/images`,





}