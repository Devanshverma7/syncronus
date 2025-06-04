export const HOST = import.meta.env.VITE_SERVER_URL;
// common route
export const AUTH_ROUTES = "api/auth";
// end points
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPADATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTE = `api/contacts`;
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTE}/search`;
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-all-contacts`;

export const MESSAGES_ROUTE = `api/messages`;
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTE}/upload-file`;

export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;

export const AI_ROUTES = "api/ai";
export const ASK_AI = `${AI_ROUTES}/send`;
export const GET_ALL_AI_CHAT = `${AI_ROUTES}/get-ai-messages`;
